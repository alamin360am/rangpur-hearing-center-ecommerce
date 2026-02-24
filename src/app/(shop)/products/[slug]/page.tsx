import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

import ProductGallery from "@/components/shop/product-gallery";
import ProductBuyBox from "@/components/shop/product-buy-box";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  const p = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { images: true, variants: true, category: true },
  });

  if (!p) return notFound();

  const basePrice = p.offerPrice ?? p.price;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{p.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4">
            <ProductGallery images={p.images} name={p.name} />
          </Card>

          <Card className="p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {p.category?.name ?? "Uncategorized"}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">{p.name}</h1>
              <p className="text-sm text-muted-foreground">
                SKU: {p.sku} • Stock: {p.stock}
              </p>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-semibold text-lg">৳ {basePrice}</p>
                {p.offerPrice ? (
                  <p className="text-xs text-muted-foreground line-through">
                    ৳ {p.price}
                  </p>
                ) : null}
              </div>

              {p.isFeatured ? (
                <span className="text-xs rounded-full border px-2 py-1 bg-black/5">
                  Featured
                </span>
              ) : null}
            </div>

            {p.description ? (
              <div className="space-y-2">
                <p className="font-medium">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {p.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No description added yet.
              </p>
            )}

            {p.variants.length ? (
              <div className="space-y-2">
                <p className="font-medium">Available Variants</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {p.variants.map((v) => (
                    <Card key={v.id} className="p-3">
                      <p className="text-sm font-medium">
                        {v.type}: {v.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Price diff: ৳ {v.priceDiff ?? 0}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Right (Sticky buy box) */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            <Card className="p-4">
              <ProductBuyBox
                productId={p.id}
                name={p.name}
                sku={p.sku}
                basePrice={basePrice}
                stock={p.stock}
                variants={p.variants}
                imageUrl={p.images?.[0]?.url ?? null}
              />
            </Card>

            <Card className="p-4 space-y-2">
              <p className="font-medium">Delivery & Support</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Nationwide courier delivery</li>
                <li>Phone support for product guidance</li>
                <li>Secure checkout (next step)</li>
              </ul>
            </Card>

            <Card className="p-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center h-11 px-5 rounded-2xl border bg-background hover:bg-black/5 transition w-full"
              >
                Back to Products
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}