import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-black/70">
          Day 1: Admin shell ready. Day 5 এ metrics/live data বসবে।
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-sm font-semibold">Total Sales</div>
          <div className="mt-2 text-2xl font-semibold">৳ 0</div>
          <div className="mt-1 text-xs text-black/60">Placeholder</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold">Total Orders</div>
          <div className="mt-2 text-2xl font-semibold">0</div>
          <div className="mt-1 text-xs text-black/60">Placeholder</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold">Total Users</div>
          <div className="mt-2 text-2xl font-semibold">0</div>
          <div className="mt-1 text-xs text-black/60">Placeholder</div>
        </Card>
      </div>
    </div>
  );
}