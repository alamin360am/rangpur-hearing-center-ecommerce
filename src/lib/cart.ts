"use client";

export type CartItem = {
  productId: string;
  variantId?: string | null;
  name: string;
  sku: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
};

const KEY = "rh_cart_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("rh_cart_updated"));
}

export function addToCart(next: CartItem) {
  const items = readCart();
  const idx = items.findIndex(
    (x) => x.productId === next.productId && (x.variantId ?? null) === (next.variantId ?? null)
  );

  if (idx >= 0) {
    items[idx] = { ...items[idx], qty: items[idx].qty + next.qty };
  } else {
    items.push(next);
  }
  writeCart(items);
  return items;
}

export function updateQty(productId: string, variantId: string | null, qty: number) {
  const items = readCart().map((x) => {
    if (x.productId === productId && (x.variantId ?? null) === (variantId ?? null)) {
      return { ...x, qty: Math.max(1, qty) };
    }
    return x;
  });
  writeCart(items);
  return items;
}

export function removeFromCart(productId: string, variantId: string | null) {
  const items = readCart().filter(
    (x) => !(x.productId === productId && (x.variantId ?? null) === (variantId ?? null))
  );
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}