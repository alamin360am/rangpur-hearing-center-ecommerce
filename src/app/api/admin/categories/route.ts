import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";

const createSchema = z.object({
  name: z.string().min(2),
  parentId: z.string().optional().nullable(),
});

export async function GET() {
  const items = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { name, parentId } = parsed.data;

  const slugBase = slugify(name);
  let slug = slugBase;
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }

  const created = await prisma.category.create({
    data: { name, slug, parentId: parentId || null },
  });

  return NextResponse.json(created, { status: 201 });
}