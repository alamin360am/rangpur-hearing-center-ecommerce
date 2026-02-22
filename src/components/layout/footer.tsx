import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/60 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">Rangpur Hearing Center</div>
          <p className="mt-2 text-sm text-black/65">
            Hearing aids, diagnostic tools, and medical equipment across Bangladesh.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Quick Links</div>
          <div className="mt-2 flex flex-col gap-2 text-black/70">
            <Link href="/products">Products</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Support</div>
          <div className="mt-2 flex flex-col gap-2 text-black/70">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-xs text-black/60">
        © {new Date().getFullYear()} Rangpur Hearing Center
      </div>
    </footer>
  );
}