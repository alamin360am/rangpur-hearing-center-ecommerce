"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const items = readCart();
      const total = items.reduce((sum, i) => sum + i.qty, 0);
      setCount(total);
    };

    update();

    window.addEventListener("rh_cart_updated", update);

    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("rh_cart_updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}