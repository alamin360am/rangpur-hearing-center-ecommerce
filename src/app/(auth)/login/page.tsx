"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res?.ok) {
      toast({ title: "Login failed", variant: "error", description: "Check email/password or account blocked." });
      return;
    }

    toast({ title: "Welcome back!", variant: "success", description: "Login successful." });
    router.push(next);
  }

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold">Login</h2>
        <p className="mt-1 text-sm text-black/70">Access your account and orders.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-black/70">
          New here?{" "}
          <Link className="font-medium text-black underline underline-offset-4" href="/register">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
}