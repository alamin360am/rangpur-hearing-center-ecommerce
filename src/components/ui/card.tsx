import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-black/10 bg-white/70 backdrop-blur " +
          "shadow-[0_14px_40px_-28px_rgba(0,0,0,0.35)]",
        className
      )}
      {...props}
    />
  );
}