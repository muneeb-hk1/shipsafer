"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const validToken = /^[a-f0-9]{64}$/.test(token);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to reset your password. Please try again.");
      } else {
        setMessage(data.message);
        window.history.replaceState(null, "", "/reset-password");
      }
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-5 py-10">
      <section className="w-full max-w-md">
        <Link href="/" className="mb-10 inline-block text-lg font-semibold">ShipSafer</Link>
        <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
        {message ? (
          <p role="status" className="mt-5 text-sm text-green-700">{message}</p>
        ) : !validToken ? (
          <p role="alert" className="mt-5 text-sm text-red-600">This reset link is invalid. Go back to login and request a new link.</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-neutral-500">Enter and confirm your new ShipSafer password.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={pending}>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required placeholder="At least 8 characters" className="h-12 px-4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} required placeholder="Re-enter your new password" className="h-12 px-4" />
              </div>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={pending} className="h-12 w-full cursor-pointer">{pending ? "Changing password…" : "Change password"}</Button>
            </form>
          </>
        )}
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold underline">Back to login</Link>
      </section>
    </main>
  );
}
