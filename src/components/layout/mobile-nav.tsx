"use client";

import Link from "next/link";
import { Heart, Home, ShoppingBag, User2, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition",
        active ? "text-black" : "text-black/60"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/80 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl px-2">
        <NavItem href="/" label="Home" icon={Home} />
        <NavItem href="/wishlist" label="Wishlist" icon={Heart} />
        <NavItem href="/cart" label="Cart" icon={ShoppingBag} />
        <NavItem href="/login" label="Account" icon={User2} />
      </div>
    </div>
  );
}