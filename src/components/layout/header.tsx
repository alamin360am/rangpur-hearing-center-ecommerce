"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User2, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import CartBadge from "../shop/cart-badge";

export function Header() {
  const pathname = usePathname();
  const { data } = useSession();
  const isAdmin = data?.user?.role === "ADMIN" || data?.user?.role === "STAFF";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-black text-white">
            R
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Rangpur Hearing</div>
            <div className="text-xs text-black/60 -mt-0.5">Medical eCommerce</div>
          </div>
        </Link>

        <div className="hidden flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
            <Input className="pl-9" placeholder="Search hearing aids, devices, tools..." />
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-2 md:flex">
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition hover:bg-black/5",
                pathname.startsWith("/admin") && "bg-black/5"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          ) : null}

          <Link className="rounded-2xl p-2 hover:bg-black/5" href="/wishlist" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
            <CartBadge />
          <Link className="rounded-2xl p-2 hover:bg-black/5" href="/login" aria-label="Account">
            <User2 className="h-5 w-5" />
          </Link>
        </nav>

        {/* Mobile search icon placeholder */}
        <div className="ml-auto md:hidden">
          <Link className="rounded-2xl p-2 hover:bg-black/5" href="/search" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
          <Input className="pl-9" placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
}