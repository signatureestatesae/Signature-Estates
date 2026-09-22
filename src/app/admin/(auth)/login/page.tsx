"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-950 px-14 py-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <Image
          src="/images/brand/logo.png"
          alt="Signature Estates"
          width={512}
          height={512}
          className="h-10 w-10 object-contain"
        />
        <div>
          <p className="font-display text-4xl font-semibold leading-tight text-white">
            Signature Estates
            <br />
            Admin Panel
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Manage off-plan projects, agents, blog content and every lead
            coming in from the site — all in one place.
          </p>
        </div>
        <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} SIGNATURE ESTATES</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-stone-100 px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/images/brand/logo.png"
              alt="Signature Estates"
              width={512}
              height={512}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-ink-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to manage the site.</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
