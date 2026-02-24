import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

function formatBDT(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function linkBtn(variant: "primary" | "secondary" | "ghost" = "primary") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary:
      "bg-black text-white hover:bg-black/90 focus-visible:ring-black shadow-[0_12px_34px_-16px_rgba(0,0,0,0.55)]",
    secondary:
      "bg-white/70 text-black hover:bg-white focus-visible:ring-black border border-black/10 backdrop-blur",
    ghost:
      "bg-transparent text-black hover:bg-black/5 focus-visible:ring-black",
  };
  const size = "h-11 px-5 text-sm";
  return cn(base, variants[variant], size);
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { images: true, category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: [{ name: "asc" }],
      take: 8,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* HERO */}
      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rangpur Hearing Care Centre
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Premium hearing care products—delivered across Bangladesh.
          </h1>

          <p className="text-muted-foreground">
            Hearing aids, accessories, diagnostic tools, and healthcare devices.
            Verified products, responsive support, and fast delivery.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/products" className={linkBtn("primary")}>
              Browse Products
            </Link>
            <Link href="/login" className={linkBtn("ghost")}>
              Login
            </Link>
            <Link href="/admin" className={linkBtn("secondary")}>
              Admin Panel
            </Link>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4">
              <p className="font-medium">Authentic Products</p>
              <p className="text-sm text-muted-foreground">
                Trusted brands & verified stock.
              </p>
            </Card>
            <Card className="p-4">
              <p className="font-medium">Fast Delivery</p>
              <p className="text-sm text-muted-foreground">
                Courier delivery nationwide.
              </p>
            </Card>
            <Card className="p-4">
              <p className="font-medium">Expert Support</p>
              <p className="text-sm text-muted-foreground">
                Guidance for setup & usage.
              </p>
            </Card>
          </div>
        </div>

        {/* HERO CARD */}
        <Card className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Quick Actions</p>
            <div className="grid gap-3">
              <Link href="/products" className={linkBtn("primary")}>
                Explore catalog
              </Link>
              <Link href="/register" className={linkBtn("secondary")}>
                Create account
              </Link>
              <Link href="/products?sort=featured" className={linkBtn("ghost")}>
                Featured picks
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              Tip: Start from featured products and compare price & stock.
            </div>
          </div>
        </Card>
      </section>

      {/* FEATURED */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <p className="text-sm text-muted-foreground">
              Popular picks from our store.
            </p>
          </div>

          <Link href="/products" className={linkBtn("ghost")}>
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-4/3 w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
                  {p.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No image
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {p.category?.name ?? "Uncategorized"}
                  </p>
                  <p className="font-medium leading-snug line-clamp-2">
                    {p.name}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      ৳ {formatBDT(p.offerPrice ?? p.price)}
                    </p>
                    {p.offerPrice ? (
                      <p className="text-xs text-muted-foreground line-through">
                        ৳ {formatBDT(p.price)}
                      </p>
                    ) : null}
                  </div>

                  <Link
                    href={`/products/${p.slug}`}
                    className={linkBtn("secondary")}
                  >
                    View
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {!featured.length ? (
            <Card className="p-6 sm:col-span-2 lg:col-span-4">
              <p className="text-muted-foreground">No featured products yet.</p>
            </Card>
          ) : null}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Shop by Category</h2>
          <p className="text-sm text-muted-foreground">
            Find products faster by category.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{c.name}</p>

                  <p className="text-xs text-muted-foreground">
                    Browse products in this category
                  </p>
                </div>

                <Link
                  href={`/products?cat=${encodeURIComponent(c.slug)}`}
                  className={linkBtn("ghost")}
                >
                  Open
                </Link>
              </div>
            </Card>
          ))}

          {!categories.length ? (
            <Card className="p-6 sm:col-span-2 lg:col-span-4">
              <p className="text-muted-foreground">No categories yet.</p>
            </Card>
          ) : null}
        </div>
      </section>

      {/* CTA */}
      <section>
        <Card className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-lg font-semibold">Need help choosing?</p>
            <p className="text-sm text-muted-foreground">
              Compare products, check stock, and place your order in minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className={linkBtn("primary")}>
              Start shopping
            </Link>
            <Link href="/login" className={linkBtn("ghost")}>
              Login
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
