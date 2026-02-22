"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer";

  const variants: Record<Variant, string> = {
    primary:
      "bg-black text-white hover:bg-black/90 focus-visible:ring-black " +
      "shadow-[0_12px_34px_-16px_rgba(0,0,0,0.55)]",
    secondary:
      "bg-white/70 text-black hover:bg-white focus-visible:ring-black border border-black/10 backdrop-blur",
    ghost:
      "bg-transparent text-black hover:bg-black/5 focus-visible:ring-black",
    danger:
      "bg-red-600 text-white hover:bg-red-600/90 focus-visible:ring-red-600",
  };

  const sizes: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}