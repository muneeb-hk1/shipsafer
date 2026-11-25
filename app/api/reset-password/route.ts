import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/password-reset";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { token, password, confirmPassword } = body ?? {};
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ error: "Use at least 8 characters and no more than 72 bytes for your password." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  try {
    const tokenHash = hashResetToken(token);
    const user = await prisma.user.findUnique({
      where: { passwordResetTokenHash: tokenHash },
      select: { id: true, passwordResetExpiresAt: true },
    });
    if (!user?.passwordResetExpiresAt || user.passwordResetExpiresAt <= new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    // Consume and update together: a reused or concurrently submitted token cannot succeed.
    const result = await prisma.user.updateMany({
      where: { id: user.id, passwordResetTokenHash: tokenHash, passwordResetExpiresAt: { gt: new Date() } },
      data: { passwordHash, passwordResetTokenHash: null, passwordResetExpiresAt: null },
    });
    if (!result.count) {
      return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
    }
    return NextResponse.json({ message: "Your password has been changed. You can now log in." });
  } catch {
    console.error("Password reset failed. Check database availability.");
    return NextResponse.json({ error: "Unable to reset your password right now. Please try again." }, { status: 503 });
  }
}
