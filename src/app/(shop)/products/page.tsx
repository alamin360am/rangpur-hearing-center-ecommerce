import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatBDT(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

type Props = {
  searchParams?: {
    q?: string;
    cat?: string;
    sort?: string;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const q = (searchParams?.q ?? "").trim();
  const cat = (searchParams?.cat ?? "").trim(); // category slug
  const sort = (searchParams?.sort ?? "featured").trim();

  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: [{ name: "asc" }],
  });

  const orderBy =
    sort === "price_asc"
      ? [{ offerPrice: "asc" as const }, { price: "asc" as const }]
      : sort === "price_desc"
      ? [{ offerPrice: "desc" as const }, { price: "desc" as const }]
      : sort === "newest"
      ? [{ createdAt: "desc" as const }]
      : [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];

  const items = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(cat ? { category: { slug: cat } } : {}),
    },
    include: { images: true, category: true },
    orderBy,
  });

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (cat) qs.set("cat", cat);
  if (sort) qs.set("sort", sort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">
          Browse hearing devices and healthcare equipment.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-3" action="/products">
          <div className="space-y-1">
            <p className="text-sm font-medium">Search</p>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or SKU..."
              className="h-10 w-full rounded-md border border-gray-300 outline-none px-3 text-sm"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Category</p>
            <select
              name="cat"
              defaultValue={cat}
              className="h-10 w-full rounded-md border border-gray-300 outline-none px-3 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Sort</p>
            <select
              name="sort"
              defaultValue={sort}
              className="h-10 w-full rounded-md border border-gray-300 outline-none px-3 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-3 pt-1">
            <Button type="submit">Apply</Button>
            <Button type="button" variant="secondary">
              <Link href="/products">Reset</Link>
            </Button>

            {(q || cat || (sort && sort !== "featured")) && (
              <p className="text-sm text-muted-foreground flex items-center">
                Showing: {items.length} item(s)
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
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
                  <span className="text-sm text-muted-foreground">No image</span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {p.category?.name ?? "Uncategorized"}
                </p>
                <p className="font-medium leading-snug line-clamp-2">{p.name}</p>
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

                <Button size="sm" variant="secondary">
                  <Link href={`/products/${p.slug}`}>View</Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                SKU: {p.sku} • Stock: {p.stock}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!items.length ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No products found.</p>
        </Card>
      ) : null}
    </div>
  );
}