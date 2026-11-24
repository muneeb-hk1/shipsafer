import { createHash, randomBytes } from "node:crypto";

export const RESET_LIFETIME_MS = 30 * 60 * 1000;
export const RESET_COOLDOWN_MS = 60 * 1000;
export const RESET_MESSAGE =
  "If an account exists for this email, you will receive a password reset link. Check your inbox and spam folder.";

export function createResetToken() {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getResetEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (!apiKey || !from || !appUrl) {
    throw new Error("Configure RESEND_API_KEY, EMAIL_FROM and APP_URL for password reset emails.");
  }
  const origin = new URL(appUrl);
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    (process.env.NODE_ENV === "production" && origin.protocol !== "https:")
  ) {
    throw new Error("APP_URL must use HTTPS in production.");
  }
  return { apiKey, from, appUrl: origin.origin };
}

export async function sendResetEmail(
  email: string,
  token: string,
  config: ReturnType<typeof getResetEmailConfig>,
) {
  // Use the configured origin, never an untrusted request Host header.
  const url = new URL("/reset-password", config.appUrl);
  url.searchParams.set("token", token);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      from: config.from,
      to: [email],
      subject: "Reset your ShipSafer password",
      text: `Reset your ShipSafer password using this link:\n\n${url}\n\nThis link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Password reset email delivery failed (${response.status}).`);
  }
}
