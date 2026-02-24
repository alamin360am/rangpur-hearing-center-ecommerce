import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const OrderCreateSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(6),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    area: z.string().optional(),
    note: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().nullable().optional(),
      qty: z.number().int().min(1),
    })
  ).min(1),
  paymentMethod: z.enum(["COD", "ONLINE"]).optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = OrderCreateSchema.parse(await req.json());

    const productIds = Array.from(
      new Set(parsed.items.map((x) => x.productId))
    );

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { variants: true },
    });

    const pMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;

    const orderItems = parsed.items.map((i) => {
      const p = pMap.get(i.productId);
      if (!p) throw new Error("Some products are unavailable.");

      const base = p.offerPrice ?? p.price;

      let variantPriceDiff = 0;
      let variantId: string | null = null;

      if (i.variantId) {
        const v = p.variants.find((x) => x.id === i.variantId);
        if (!v) throw new Error("Invalid variant selected.");
        variantPriceDiff = v.priceDiff ?? 0;
        variantId = v.id;
      }

      const unitPrice = base + variantPriceDiff;
      const lineTotal = unitPrice * i.qty;
      subtotal += lineTotal;

      return {
        productId: p.id,
        variantId,
        productName: p.name,
        sku: p.sku,
        unitPrice,
        qty: i.qty,
        lineTotal,
      };
    });

    const total = subtotal;

    const created = await prisma.order.create({
      data: {
        name: parsed.customer.name,
        email: parsed.customer.email ?? null,
        phone: parsed.customer.phone,
        addressLine1: parsed.customer.addressLine1,
        addressLine2: parsed.customer.addressLine2 ?? null,
        city: parsed.customer.city,
        area: parsed.customer.area ?? null,
        note: parsed.customer.note ?? null,
        subtotal,
        total,
        paymentMethod: parsed.paymentMethod ?? "COD",
        paymentStatus: "UNPAID",
        items: { create: orderItems },
      },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Order create failed." },
      { status: 500 }
    );
  }
}