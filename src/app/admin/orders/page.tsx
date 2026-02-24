import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import OrderStatusInline from "@/components/admin/order-status-inline";

function formatBDT(v: number) {
  return new Intl.NumberFormat("bn-BD").format(v);
}

function statusBadge(status: string) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium";
  if (status === "DELIVERED") return `${base} bg-green-50`;
  if (status === "CANCELLED") return `${base} bg-red-50`;
  if (status === "SHIPPED") return `${base} bg-blue-50`;
  if (status === "PROCESSING") return `${base} bg-yellow-50`;
  return `${base} bg-black/5`;
}

function toInt(x: string | undefined, fallback: number) {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
    q?: string;
  }>;
}) {
  const sp = await searchParams;

  const page = toInt(sp.page, 1);
  const pageSize = Math.min(toInt(sp.pageSize, 10), 100);

  const status = (sp.status || "").trim();
  const q = (sp.q || "").trim();

  const where = {
    ...(status
      ? {
          status: status as
            | "PENDING"
            | "PROCESSING"
            | "SHIPPED"
            | "DELIVERED"
            | "CANCELLED",
        }
      : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildUrl = (
    next: Partial<{
      page: number;
      pageSize: number;
      status: string;
      q: string;
    }>,
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(next.page ?? page));
    params.set("pageSize", String(next.pageSize ?? pageSize));
    if ((next.status ?? status).trim())
      params.set("status", (next.status ?? status).trim());
    if ((next.q ?? q).trim()) params.set("q", (next.q ?? q).trim());
    return `/admin/orders?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter and manage orders.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-2xl border bg-background px-4 text-sm hover:bg-black/5 transition"
        >
          Back
        </Link>
      </div>

      {/* Filters (GET form => query string) */}
      <Card className="p-4">
        <form
          className="flex flex-wrap gap-3 items-end"
          action="/admin/orders"
          method="get"
        >
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="pageSize" value={String(pageSize)} />

          <div className="space-y-1">
            <p className="text-xs">Search</p>
            <input
              name="q"
              defaultValue={q}
              className="h-9 rounded-md border px-3 text-sm"
              placeholder="Order ID / Name / Phone"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs">Status</p>
            <select
              name="status"
              defaultValue={status}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value="">All</option>
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <button className="h-9 px-4 rounded-2xl bg-black text-white text-sm">
            Apply
          </button>

          {q || status ? (
            <Link
              href="/admin/orders"
              className="h-9 px-4 rounded-2xl border bg-background hover:bg-black/5 transition text-sm inline-flex items-center justify-center"
            >
              Reset
            </Link>
          ) : null}
        </form>
      </Card>

      {/* Table */}
      <Card className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b">
            <tr>
              <th className="py-2">Date</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-b-0">
                <td className="py-3 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="font-mono text-xs">{o.id.slice(0, 8)}...</td>
                <td>{o.name}</td>
                <td className="whitespace-nowrap">{o.phone}</td>
                <td>{o.items.length}</td>
                <td className="whitespace-nowrap">৳ {formatBDT(o.total)}</td>
                <td className="py-3">
                  <OrderStatusInline orderId={o.id} initialStatus={o.status} />
                </td>
                <td className="text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-2xl border bg-background px-4 text-sm hover:bg-black/5 transition"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {!orders.length ? (
              <tr>
                <td colSpan={8} className="py-8 text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <Link
          aria-disabled={page <= 1}
          href={buildUrl({ page: Math.max(1, page - 1) })}
          className={`px-3 py-1 border rounded-md ${
            page <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Prev
        </Link>

        <span>
          Page {page} of {totalPages} • Total {total}
        </span>

        <Link
          aria-disabled={page >= totalPages}
          href={buildUrl({ page: Math.min(totalPages, page + 1) })}
          className={`px-3 py-1 border rounded-md ${
            page >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
