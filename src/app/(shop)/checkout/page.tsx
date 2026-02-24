"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem, clearCart, readCart } from "@/lib/cart";

function formatBDT(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

export default function CheckoutPage() {
  // ✅ hydration-safe: render nothing meaningful until mounted
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );

  useEffect(() => {
    setMounted(true);

    const sync = () => setItems(readCart());
    sync();

    window.addEventListener("rh_cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rh_cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "Rangpur",
    area: "",
    note: "",
    paymentMethod: "COD" as "COD" | "ONLINE",
  });

  const onChange = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const submit = async () => {
    setErr(null);

    if (!items.length) {
      setErr("Your cart is empty.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      setErr("Name and phone are required.");
      return;
    }
    if (!form.addressLine1.trim() || !form.city.trim()) {
      setErr("Address and city are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email || undefined,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            area: form.area || undefined,
            note: form.note || undefined,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId ?? null,
            qty: i.qty,
          })),
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error ?? "Checkout failed");
        return;
      }

      clearCart(); // triggers rh_cart_updated
      window.location.href = `/checkout/success?orderId=${encodeURIComponent(
        data.id,
      )}`;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </Card>
      </div>
    );
  }

  // after mounted, decide empty vs form
  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-6 text-sm font-medium text-white hover:bg-black/90 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 space-y-4">
            <p className="font-semibold">Customer Information</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Full name *</p>
                <input
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Phone *</p>
                <input
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium">Email (optional)</p>
                <input
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <p className="font-semibold">Delivery Address</p>

            <div className="space-y-1">
              <p className="text-sm font-medium">Address line 1 *</p>
              <input
                value={form.addressLine1}
                onChange={(e) => onChange("addressLine1", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                placeholder="House, Road, Area"
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Address line 2 (optional)</p>
              <input
                value={form.addressLine2}
                onChange={(e) => onChange("addressLine2", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                placeholder="Floor, apartment etc."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">City *</p>
                <input
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Area (optional)</p>
                <input
                  value={form.area}
                  onChange={(e) => onChange("area", e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="e.g. Modern Mor"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Note (optional)</p>
              <textarea
                value={form.note}
                onChange={(e) => onChange("note", e.target.value)}
                className="min-h-22.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Any delivery note..."
              />
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <p className="font-semibold">Payment</p>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={form.paymentMethod === "COD"}
                onChange={() => onChange("paymentMethod", "COD")}
              />
              <span className="text-sm">Cash on Delivery (COD)</span>
            </div>

            <div className="flex items-center gap-2 opacity-60">
              <input
                type="radio"
                name="payment"
                checked={form.paymentMethod === "ONLINE"}
                onChange={() => onChange("paymentMethod", "ONLINE")}
                disabled
              />
              <span className="text-sm">Online payment (coming soon)</span>
            </div>

            {err ? <p className="text-sm text-red-600">{err}</p> : null}

            <Button onClick={submit} disabled={loading}>
              {loading ? "Placing order..." : "Place Order"}
            </Button>

            <Link
              href="/cart"
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to cart
            </Link>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-6 space-y-4">
            <Card className="p-4 space-y-3">
              <p className="font-semibold">Order Summary</p>

              <div className="space-y-2">
                {items.map((i) => (
                  <div
                    key={`${i.productId}-${i.variantId ?? "base"}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground line-clamp-1">
                      {i.name} × {i.qty}
                    </span>
                    <span>৳ {formatBDT(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳ {formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>0 (MVP)</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>৳ {formatBDT(subtotal)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
