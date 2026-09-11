"use client";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

type AuthMode = "login" | "signup";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [forgetPassword, setForgetPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLogin) {
      router.push("/login");
    }
  };

  return (
    <main className="grid min-h-svh bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src="/login.png"
          alt="Friendly shipping assistant in a flower-filled landscape"
          fill
          priority
          sizes="(min-width: 1024px) 53vw, 0vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/5" />
        <Link
          href="/"
          className="absolute left-10 top-10 text-xl font-semibold tracking-tight text-white drop-shadow-sm"
        >
          ShipSafer
        </Link>
        <div className="absolute bottom-10 left-10 max-w-md text-white">
          <p className="text-3xl font-medium leading-tight">
            Ship with confidence. Every time.
          </p>
          <p className="mt-3 text-sm text-white/80">
            Simple tools to help your deliveries arrive safely.
          </p>
        </div>
      </section>

      <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-block text-lg font-semibold tracking-tight lg:hidden"
          >
            ShipSafer
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              {forgetPassword ? "Reset your password" : isLogin ? "Log in to your account" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {isLogin
                ? "Enter your details to continue to ShipSafer."
                : "A few details and you’ll be ready to start shipping."}
            </p>
          </div>

          {forgetPassword ? (
            <div>
              <form>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Email">Email address</label>
                  <Input
                    type="email"
                    id="Email"
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-lg border border-neutral-300 bg-transparent px-4 text-sm placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div className="mt-3">
                  <Button type="submit" className="p-5 cursor-pointer">Send reset link</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setForgetPassword(false);
                    }}
                    className="p-5 cursor-pointer"
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      className="h-12 px-4"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <Button
                        type="button"
                        onClick={() => { setForgetPassword(true) }}
                        className="text-xs font-medium text-black cursor-pointer underline bg-transparent hover:bg-transparent"
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={
                      isLogin ? "Enter your password" : "At least 8 characters"
                    }
                    minLength={isLogin ? undefined : 8}
                    required
                    className="h-12 px-4"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-lg text-sm cursor-pointer"
                >
                  {isLogin ? "Log in" : "Create account"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-neutral-500">
                {isLogin ? "New to ShipSafer?" : "Already have an account?"}{" "}
                <Link
                  href={isLogin ? "/signup" : "/login"}
                  className="font-semibold text-neutral-950 hover:underline"
                >
                  {isLogin ? "Create an account" : "Log in"}
                </Link>
              </p>
              {!isLogin && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "/dashboard",
                      })
                    }
                    className="flex px-2 py-2 cursor-pointer items-center justify-center gap-4 rounded-full border border-black/50 bg-white text-[18px] font-semibold transition hover:bg-black/[0.03]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[24px] font-bold">
                      <span className="text-[#000000]">G</span>
                    </span>
                    {/* Google */}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      signIn("github", { 
                        callbackUrl: "/dashboard",
                      })
                    }
                    className="flex px-2 py-2 cursor-pointer items-center justify-center gap-4 rounded-full border border-black/50 bg-white text-[18px] font-semibold transition hover:bg-black/[0.03]"
                  >


                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[24px] font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </span>

                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
