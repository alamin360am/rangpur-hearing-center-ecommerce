import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white/70 p-8 backdrop-blur">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Premium medical eCommerce for hearing care.
          </h1>
          <p className="mt-3 text-sm text-black/70 md:text-base">
            Hearing aids, diagnostic tools, and healthcare devices—fast delivery across Bangladesh.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-black/5 blur-2xl" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-sm font-semibold">Admin Controlled</div>
          <p className="mt-2 text-sm text-black/70">Full control over products, orders, and settings.</p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold">Secure Auth</div>
          <p className="mt-2 text-sm text-black/70">Role-based access (Admin/Staff/User) + protected routes.</p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-semibold">Fast & Responsive</div>
          <p className="mt-2 text-sm text-black/70">Modern UI, mobile-first UX, optimized performance.</p>
        </Card>
      </section>
    </div>
  );
}