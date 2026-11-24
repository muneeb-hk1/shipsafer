import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

function getKey() {
  const value = process.env.GITHUB_TOKEN_ENCRYPTION_KEY;

  if (!value || !/^[a-f0-9]{64}$/i.test(value)) {
    throw new Error("Invalid GITHUB_TOKEN_ENCRYPTION_KEY");
  }

  return Buffer.from(value, "hex");
}

export function encryptToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("hex"),
    cipher.getAuthTag().toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decryptToken(value: string) {
  const parts = value.split(":");

  if (
    parts.length !== 3 ||
    !/^[a-f0-9]{24}$/i.test(parts[0]) ||
    !/^[a-f0-9]{32}$/i.test(parts[1]) ||
    !/^(?:[a-f0-9]{2})+$/i.test(parts[2])
  ) {
    throw new Error("Invalid encrypted token");
  }

  const [iv, tag, encrypted] = parts;

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "hex")),
    decipher.final(),
  ]).toString("utf8");
}