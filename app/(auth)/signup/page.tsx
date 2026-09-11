import type { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign up | ShipSafer",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
