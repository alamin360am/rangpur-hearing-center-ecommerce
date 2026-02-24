"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const ToastContext = React.createContext<{
  toast: (props: Omit<ToastItem, "id">) => void;
} | null>(null);

const animationStyles = `
@media (prefers-reduced-motion: reduce) {
  .toast-enter, .toast-exit, .toast-progress { animation: none !important; }
}

/* Modern: subtle slide + fade + micro-scale */
@keyframes toastEnter {
  0%   { opacity: 0; transform: translateY(-10px) scale(0.98); filter: blur(2px); }
  60%  { opacity: 1; transform: translateY(0) scale(1.00); filter: blur(0px); }
  100% { opacity: 1; transform: translateY(0) scale(1.00); }
}

/* Exit: fade + slight lift + micro-shrink */
@keyframes toastExit {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-6px) scale(0.98); }
}

@keyframes progress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

.toast-enter {
  animation: toastEnter 420ms cubic-bezier(.16,1,.3,1) both;
}

.toast-exit {
  animation: toastExit 240ms cubic-bezier(.4,0,1,1) both;
}

.toast-progress {
  transform-origin: left;
  animation: progress 4s linear forwards;
}
`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const [closingIds, setClosingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = animationStyles;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}, []);

  const closeToast = React.useCallback((id: string) => {
    setClosingIds((prev) => new Set(prev).add(id));

    // exit duration sync
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setClosingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 240);
  }, []);

  const toast = (props: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setItems((prev) => [
      ...prev,
      { ...props, id, variant: props.variant || "success" },
    ]);

    setTimeout(() => closeToast(id), 4000);
  };

  const getIcon = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="text-emerald-500" size={20} />;
      case "error":
        return <XCircle className="text-rose-500" size={20} />;
      case "info":
        return <AlertCircle className="text-sky-500" size={20} />;
    }
  };

  const variantDot = (variant: ToastVariant) => {
    const base = "h-2 w-2 rounded-full";
    if (variant === "success") return `${base} bg-emerald-500/90`;
    if (variant === "error") return `${base} bg-rose-500/90`;
    return `${base} bg-sky-500/90`;
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-99999 flex flex-col gap-2.5 w-full max-w-md px-4">
        {items.map((item) => {
          const variant = item.variant || "success";
          const isClosing = closingIds.has(item.id);

          return (
            <div
              key={item.id}
              className={[
                "relative overflow-hidden rounded-2xl",
                "backdrop-blur-xl",
                "bg-white/75 dark:bg-zinc-950/70",
                "border border-black/5 dark:border-white/10",
                "shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
                "ring-1 ring-white/30 dark:ring-white/5",
                isClosing ? "toast-exit" : "toast-enter",
              ].join(" ")}
            >
              {/* Top accent hairline (modern touch) */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

              <div className="flex items-start gap-3 p-3">
                {/* Icon + dot */}
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={variantDot(variant)} />
                  {getIcon(variant)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-4 text-zinc-900 dark:text-white truncate">
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="mt-1 text-[12px] leading-4 text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => closeToast(item.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                  aria-label="Close toast"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress Bar (thin + smooth) */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/10">
                <div
                  className={[
                    "h-full w-full toast-progress",
                    variant === "success" && "bg-emerald-500",
                    variant === "error" && "bg-rose-500",
                    variant === "info" && "bg-sky-500",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}