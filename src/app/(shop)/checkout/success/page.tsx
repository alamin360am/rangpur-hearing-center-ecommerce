import Link from "next/link";
import { Card } from "@/components/ui/card";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
      <Card className="p-6 space-y-3">
        <h1 className="text-2xl font-bold">Order placed ✅</h1>
        <p className="text-muted-foreground">
          Thank you! Your order has been placed successfully.
        </p>

        {orderId ? (
          <p className="text-sm">
            <span className="text-muted-foreground">Order ID:</span>{" "}
            <span className="font-mono">{orderId}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-6 text-sm font-medium text-white hover:bg-black/90 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl border bg-background px-6 text-sm font-medium hover:bg-black/5 transition"
          >
            Go Home
          </Link>
        </div>
      </Card>
    </div>
  );
}