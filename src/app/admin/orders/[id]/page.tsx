import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import OrderStatusEditor from "@/components/admin/order-status-editor";

function formatBDT(v: number) {
  return new Intl.NumberFormat("bn-BD").format(v);
}

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const o = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { id: true, email: true } } },
  });

  if (!o) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {o.id}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex h-10 items-center justify-center rounded-2xl border bg-background px-4 text-sm hover:bg-black/5 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: order + items */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Customer</p>

            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{o.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{o.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{o.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">User</p>
                <p className="font-medium">{o.user?.email ?? "Guest"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <p className="font-semibold">Delivery Address</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground">{o.addressLine1}</p>
              {o.addressLine2 ? <p className="text-foreground">{o.addressLine2}</p> : null}
              <p>
                {o.area ? `${o.area}, ` : ""}{o.city}
              </p>
              {o.note ? (
                <p className="pt-2">
                  <span className="text-muted-foreground">Note:</span>{" "}
                  <span className="text-foreground">{o.note}</span>
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <p className="font-semibold">Items</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Unit</th>
                    <th className="py-2 pr-0 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((it) => (
                    <tr key={it.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-3">{it.productName}</td>
                      <td className="py-3 pr-3 font-mono text-xs">{it.sku}</td>
                      <td className="py-3 pr-3">{it.qty}</td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        ৳ {formatBDT(it.unitPrice)}
                      </td>
                      <td className="py-3 pr-0 text-right whitespace-nowrap">
                        ৳ {formatBDT(it.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳ {formatBDT(o.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>৳ {formatBDT(o.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>৳ {formatBDT(o.shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>৳ {formatBDT(o.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: status */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <p className="text-lg font-semibold">{o.status}</p>
            </div>

            <OrderStatusEditor orderId={o.id} initialStatus={o.status} />
          </Card>

          <Card className="p-4 space-y-2">
            <p className="font-semibold">Payment</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="text-muted-foreground">Method:</span>{" "}
                <span className="text-foreground">{o.paymentMethod}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="text-foreground">{o.paymentStatus}</span>
              </p>
              {o.transactionId ? (
                <p className="font-mono text-xs">{o.transactionId}</p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}