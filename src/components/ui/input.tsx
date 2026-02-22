"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-black/10 bg-white/70 px-4 text-sm " +
          "outline-none backdrop-blur transition placeholder:text-black/40 " +
          "focus:border-black/30 focus:ring-2 focus:ring-black/10",
        className
      )}
      {...props}
    />
  );
}