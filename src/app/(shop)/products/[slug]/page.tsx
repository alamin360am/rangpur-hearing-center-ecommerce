import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, variants: true, category: true },
  });

  if (!p || !p.isActive) return notFound();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <div className="aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.images[0]?.url || "/placeholder.png"}
            alt={p.name}
            className="h-full w-full object-cover"
          />
        </div>

        {p.images.length > 1 ? (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {p.images.slice(0, 5).map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={p.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="space-y-4">
        <div>
          <div className="text-xs text-black/60">{p.category.name}</div>
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-xl font-semibold">৳ {p.offerPrice ?? p.price}</div>
            {p.offerPrice ? <div className="text-sm text-black/50 line-through">৳ {p.price}</div> : null}
          </div>
          <div className="mt-2 text-sm text-black/70">SKU: {p.sku} • Stock: {p.stock}</div>
        </div>

        {p.description ? (
          <Card className="p-4">
            <div className="text-sm font-semibold">Description</div>
            <p className="mt-2 text-sm text-black/70 whitespace-pre-line">{p.description}</p>
          </Card>
        ) : null}

        {p.variants.length ? (
          <Card className="p-4">
            <div className="text-sm font-semibold">Variants</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.variants.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-black/10 bg-white/60 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{v.type}</span>: {v.value}
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Button>Add to Cart (Day 4)</Button>
      </div>
    </div>
  );
}