import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true, category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-black/70">Browse hearing devices and healthcare equipment.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}>
            <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]">
              <div className="aspect-4/3 rounded-2xl border border-black/10 bg-white/60 overflow-hidden">
                {/* simple image fallback */}
                {p.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-black/50">No image</div>
                )}
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-black/60">{p.category.name}</div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="text-sm font-semibold">৳ {p.offerPrice ?? p.price}</div>
                  {p.offerPrice ? (
                    <div className="text-xs text-black/50 line-through">৳ {p.price}</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3">
                <Button variant="secondary" className="w-full">
                  View
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {!items.length ? <div className="text-sm text-black/60">No products found.</div> : null}
    </div>
  );
}