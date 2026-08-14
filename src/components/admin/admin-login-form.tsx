"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gbautozone.ge");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "…" : "Sign in"}
      </Button>
      <p className="text-xs text-[var(--muted)]">
        Default: admin@gbautozone.ge / admin123 (change in .env)
      </p>
    </form>
  );
}
