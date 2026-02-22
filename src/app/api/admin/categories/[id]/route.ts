import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";

type Ctx = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(2),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { name, parentId, isActive } = parsed.data;

  // unique slug (allow same category)
  const slugBase = slugify(name);
  let slug = slugBase;
  let i = 1;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    slug = `${slugBase}-${i++}`;
  }

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentId: parentId ?? null,
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };

    // FK constraint (rare here)
    if (e.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot update: linked data constraint." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Update failed", detail: e.message ?? "Unknown" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const exists = await prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Optional safety: if category has products, block delete (nice UX)
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete: category has products. Move products first." },
        { status: 409 }
      );
    }

    // Optional safety: if category has children, block delete
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete: category has subcategories. Delete/move them first." },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };

    if (e.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete: linked data constraint." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Delete failed", detail: e.message ?? "Unknown" },
      { status: 500 }
    );
  }
}