import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rangpur Hearing Center",
  description: "Medical eCommerce for hearing aids and healthcare devices",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(0,0,0,0.06),transparent_40%),radial-gradient(900px_circle_at_90%_20%,rgba(0,0,0,0.04),transparent_45%)]">
            <Header />
            <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-8">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}