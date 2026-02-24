"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Signup failed", variant: "error", description: data?.error || "Try again." });
      return;
    }

    toast({ title: "Account created", variant:"success", description: "Logging you in..." });
    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
  }

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold">Create account</h2>
        <p className="mt-1 text-sm text-black/70">Start shopping medical devices.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min 6 characters"
              type="password"
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-black/70">
          Already have an account?{" "}
          <Link className="font-medium text-black underline underline-offset-4" href="/login">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}