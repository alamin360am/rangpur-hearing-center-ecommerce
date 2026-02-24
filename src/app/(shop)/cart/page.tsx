"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  readCart,
  updateQty,
  removeFromCart,
  clearCart,
  CartItem,
} from "@/lib/cart";

function formatBDT(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

export default function CartPage() {
  // ✅ Lazy init: no effect needed to load initial cart
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  // ✅ subscribe to cart updates (same tab + other tabs)
  useEffect(() => {
    const sync = () => setItems(readCart());

    window.addEventListener("rh_cart_updated", sync);
    window.addEventListener("storage", sync); // other tabs

    return () => {
      window.removeEventListener("rh_cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const onQty = (productId: string, variantId: string | null, qty: number) => {
    updateQty(productId, variantId, qty);
    // state will auto sync via rh_cart_updated
  };

  const onRemove = (productId: string, variantId: string | null) => {
    removeFromCart(productId, variantId);
  };

  const onClear = () => {
    clearCart();
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-6">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">
          Browse products and add items to your cart.
        </p>
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
      <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const key = `${item.productId}-${item.variantId ?? "base"}`;

            return (
              <Card key={key} className="p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>

                    <p className="font-semibold">৳ {formatBDT(item.price)}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onQty(item.productId, item.variantId ?? null, item.qty - 1)
                        }
                        className="h-8 w-8 rounded-md border bg-background hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="min-w-[2ch] text-center">{item.qty}</span>

                      <button
                        type="button"
                        onClick={() =>
                          onQty(item.productId, item.variantId ?? null, item.qty + 1)
                        }
                        className="h-8 w-8 rounded-md border bg-background hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemove(item.productId, item.variantId ?? null)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-semibold">
                    ৳ {formatBDT(item.price * item.qty)}
                  </div>
                </div>
              </Card>
            );
          })}

          <Button variant="secondary" onClick={onClear}>
            Clear Cart
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <Card className="p-4 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>৳ {formatBDT(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>৳ {formatBDT(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-black text-white text-sm font-medium hover:bg-black/90 transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border bg-background hover:bg-black/5 transition"
              >
                Continue Shopping
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}