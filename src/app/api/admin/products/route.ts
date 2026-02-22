import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, makeSku } from "@/lib/slug";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  price: z.number().int().min(0),
  offerPrice: z.number().int().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
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

export async function GET() {
  const items = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const g = await requireAdmin(req);
  if (!g.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data = parsed.data;

  // unique slug
  const slugBase = slugify(data.name);
  let slug = slugBase;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }

  // unique SKU
  let sku = makeSku("RHC");
  while (await prisma.product.findUnique({ where: { sku } })) {
    sku = makeSku("RHC");
  }

  const created = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      price: data.price,
      offerPrice: data.offerPrice ?? null,
      stock: data.stock,
      sku,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,

      images: data.images?.length
        ? {
            create: data.images.map((url, idx) => ({
              url,
              sortOrder: idx,
            })),
          }
        : undefined,

      variants: data.variants?.length
        ? {
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

  return NextResponse.json(created, { status: 201 });
}