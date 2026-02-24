"use client";

import { useState } from "react";

const STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type Props = {
  orderId: string;
  initialStatus: string;
};

export default function OrderStatusInline({ orderId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.error ? "Invalid status" : "Update failed");
        return;
      }
      setMsg("✅");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
      // msg auto clear after a bit
      setTimeout(() => setMsg(null), 1500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 rounded-md border bg-background px-2 text-xs"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="h-9 rounded-md border px-3 text-xs hover:bg-black/5 disabled:opacity-50"
      >
        {saving ? "..." : "Update"}
      </button>

      {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
    </div>
  );
}