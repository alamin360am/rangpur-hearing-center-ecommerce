"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { useToast } from "../ui/toast";

type Variant = {
  id: string;
  type: string;
  value: string;
  priceDiff: number | null;
};

type Props = {
  productId: string;
  name: string;
  sku: string;
  basePrice: number; // offerPrice ?? price
  stock: number;
  variants: Variant[];
  imageUrl?: string | null;
};

export default function ProductBuyBox({
  productId,
  name,
  sku,
  basePrice,
  stock,
  variants,
  imageUrl,
}: Props) {
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | null>(variants?.[0]?.id ?? null);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? null,
    [variants, variantId]
  );
    
  const {toast} = useToast();

  const unitPrice = useMemo(() => basePrice + (selectedVariant?.priceDiff ?? 0), [basePrice, selectedVariant]);

  const canBuy = stock > 0;

  const inc = () => setQty((q) => Math.min(stock || 1, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    if (!canBuy) return;

    addToCart({
      productId,
      variantId,
      name,
      sku,
      price: unitPrice,
      qty,
      imageUrl: imageUrl ?? null,
    });

    toast({
        variant: "success",
        title: "Success",
        description: "Successfully Added to Cart"
    })

  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Price</p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-bold">৳ {unitPrice}</p>
          <p className="text-sm text-muted-foreground">Stock: {stock}</p>
        </div>
      </div>

      {variants?.length ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Variant</p>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={variantId ?? ""}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.type}: {v.value}
                {v.priceDiff ? ` (+৳ ${v.priceDiff})` : ""}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={dec}
            className="h-9 w-9 rounded-md border bg-background hover:bg-black/5"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="min-w-[2ch] text-center">{qty}</span>

          <button
            type="button"
            onClick={inc}
            className="h-9 w-9 rounded-md border bg-background hover:bg-black/5"
            aria-label="Increase quantity"
            disabled={!canBuy}
          >
            +
          </button>
        </div>
      </div>

      <Button className="w-full" onClick={onAdd} disabled={!canBuy}>
        {canBuy ? "Add to Cart" : "Out of Stock"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Tip: After adding to cart, we’ll build the cart page next.
      </p>
    </div>
  );
}