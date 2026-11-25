import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createResetToken, getResetEmailConfig, hashResetToken, RESET_COOLDOWN_MS,
  RESET_LIFETIME_MS, RESET_MESSAGE, sendResetEmail,
} from "@/lib/password-reset";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    // Fail for every email if configuration is missing, without revealing accounts.
    const config = getResetEmailConfig();
    const token = createResetToken();
    const tokenHash = hashResetToken(token);
    const now = new Date();
    // An atomic cooldown also prevents concurrent requests from sending duplicate emails.
    const result = await prisma.user.updateMany({
      where: {
        email,
        OR: [
          { passwordResetRequestedAt: null },
          { passwordResetRequestedAt: { lt: new Date(now.getTime() - RESET_COOLDOWN_MS) } },
        ],
      },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: new Date(now.getTime() + RESET_LIFETIME_MS),
        passwordResetRequestedAt: now,
      },
    });
    if (result.count) {
      try {
        await sendResetEmail(email, token, config);
      } catch {
        // Clear only this request's token so a delivery failure can be retried.
        await prisma.user.updateMany({
          where: { email, passwordResetTokenHash: tokenHash },
          data: { passwordResetTokenHash: null, passwordResetExpiresAt: null, passwordResetRequestedAt: null },
        });
        console.error("Password reset email delivery failed. Check the email provider configuration.");
        // Keep the same public response for existing and unknown accounts.
      }
    }
    return NextResponse.json({ message: RESET_MESSAGE });
  } catch {
    console.error("Password reset request failed. Check database and email configuration.");
    return NextResponse.json({ error: "Unable to send a reset link right now. Please try again later." }, { status: 503 });
  }
}
