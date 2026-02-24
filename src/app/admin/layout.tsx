import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Role = "ADMIN" | "STAFF" | "USER";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as Role | undefined;

  if (!session) redirect("/login?next=/admin");
  if (role !== "ADMIN" && role !== "STAFF") redirect("/");

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="rounded-3xl border border-black/10 bg-white/70 p-4 backdrop-blur">
        <div className="text-sm font-semibold">Admin Panel</div>
        <nav className="mt-4 flex flex-col gap-2 text-sm text-black/70">
          <Link className="rounded-2xl px-3 py-2 hover:bg-black/5" href="/admin">
            Dashboard
          </Link>
          <Link className="rounded-2xl px-3 py-2 hover:bg-black/5" href="/admin/categories">
            Categories
          </Link>
          <Link className="rounded-2xl px-3 py-2 hover:bg-black/5" href="/admin/products">
            Products
          </Link>
          <Link className="rounded-2xl px-3 py-2 hover:bg-black/5" href="/admin/orders">
            Orders
          </Link>
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}