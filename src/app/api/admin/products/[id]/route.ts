import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";

type Ctx = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  price: z.number().int().min(0),
  offerPrice: z.number().int().min(0).optional().nullable(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.string().min(1)).optional(),
  variants: z
    .array(
      z.object({
        type: z.string().min(1),
        value: z.string().min(1),
        priceDiff: z.number().int().default(0),
        stock: z.number().int().min(0).default(0),
      })
    )
    .optional(),
});

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data = parsed.data;

  const slugBase = slugify(data.name);
  let slug = slugBase;
  let i = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    slug = `${slugBase}-${i++}`;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      price: data.price,
      offerPrice: data.offerPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,
      images: data.images
        ? { deleteMany: {}, create: data.images.map((url, idx) => ({ url, sortOrder: idx })) }
        : undefined,
      variants: data.variants
        ? {
            deleteMany: {},
            create: data.variants.map((v) => ({
              type: v.type,
              value: v.value,
              priceDiff: v.priceDiff,
              stock: v.stock,
            })),
          }
        : undefined,
    },
    include: { category: true, images: true, variants: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    if (e.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete: product is linked with other data." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Delete failed", detail: e.message ?? "Unknown" }, { status: 500 });
  }
}