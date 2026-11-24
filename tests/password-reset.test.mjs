/* Run with: node --test tests/password-reset.test.mjs */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import bcrypt from "bcryptjs";

const nativeRequire = createRequire(import.meta.url);

// Load the actual route code with an isolated database and email transport.
function setup() {
  const user = { id: "test-user", email: "user@example.com", passwordHash: "old", passwordResetRequestedAt: null };
  const emails = [];
  let deliveryFails = false;
  const env = { RESEND_API_KEY: "test-key", EMAIL_FROM: "ShipSafer <reset@example.com>", APP_URL: "https://shipsafer.example" };
  const prisma = { user: {
    async findUnique({ where }) {
      return user.passwordResetTokenHash === where.passwordResetTokenHash ? { ...user } : null;
    },
    async updateMany({ where, data }) {
      const matches = (!where.email || where.email === user.email)
        && (!where.id || where.id === user.id)
        && (!where.passwordResetTokenHash || where.passwordResetTokenHash === user.passwordResetTokenHash)
        && (!where.passwordResetExpiresAt || user.passwordResetExpiresAt > where.passwordResetExpiresAt.gt)
        && (!where.OR || !user.passwordResetRequestedAt || user.passwordResetRequestedAt < where.OR[1].passwordResetRequestedAt.lt);
      if (matches) Object.assign(user, data);
      return { count: matches ? 1 : 0 };
    },
  } };
  const modules = { "@/lib/prisma": { prisma } };
  function load(relative) {
    const filename = path.join(import.meta.dirname, "..", relative);
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    const exports = {};
    vm.runInNewContext(compiled, {
      exports, require: (name) => modules[name] || nativeRequire(name), process: { env },
      URL, Buffer, AbortSignal, console: { error() {} },
      fetch: async (_url, options) => {
        if (deliveryFails) return { ok: false, status: 500 };
        emails.push(JSON.parse(options.body));
        return { ok: true };
      },
    }, { filename });
    return exports;
  }
  modules["@/lib/password-reset"] = load("lib/password-reset.ts");
  const forgot = load("app/api/forgot-password/route.ts").POST;
  const reset = load("app/api/reset-password/route.ts").POST;
  const post = (handler, body) => handler(new Request("https://shipsafer.example/api", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  return { user, emails, env, forgot: (body) => post(forgot, body), reset: (body) => post(reset, body),
    failDelivery: () => { deliveryFails = true; },
    getToken: () => new URL(emails.at(-1).text.match(/https:\/\/\S+/)[0]).searchParams.get("token"),
  };
}

test("request normalizes email, stores only a hash, and hides unknown accounts", async () => {
  const s = setup();
  const response = await s.forgot({ email: " USER@Example.com " });
  assert.equal(response.status, 200);
  assert.equal(s.emails[0].to[0], "user@example.com");
  assert.notEqual(s.user.passwordResetTokenHash, s.getToken());
  assert.equal(s.user.passwordResetTokenHash.length, 64);
  const unknown = await s.forgot({ email: "unknown@example.com" });
  assert.deepEqual(await response.json(), await unknown.json());
  assert.equal(s.emails.length, 1);
});

test("cooldown prevents duplicate delivery; a later request replaces the previous link", async () => {
  const s = setup();
  await s.forgot({ email: s.user.email });
  const firstToken = s.getToken();
  await s.forgot({ email: s.user.email });
  assert.equal(s.emails.length, 1);
  s.user.passwordResetRequestedAt = new Date(Date.now() - 61_000);
  await s.forgot({ email: s.user.email });
  assert.equal(s.emails.length, 2);
  assert.equal((await s.reset({ token: firstToken, password: "new-password", confirmPassword: "new-password" })).status, 400);
});

test("new password is hashed, authenticates with bcrypt, and token is single-use", async () => {
  const s = setup();
  await s.forgot({ email: s.user.email });
  const body = { token: s.getToken(), password: "new-password", confirmPassword: "new-password" };
  assert.equal((await s.reset(body)).status, 200);
  assert.equal(await bcrypt.compare(body.password, s.user.passwordHash), true);
  assert.equal(s.user.passwordResetTokenHash, null);
  assert.equal((await s.reset(body)).status, 400);
});

test("concurrent submissions consume a token only once", async () => {
  const s = setup();
  await s.forgot({ email: s.user.email });
  const body = { token: s.getToken(), password: "new-password", confirmPassword: "new-password" };
  const results = await Promise.all([s.reset(body), s.reset(body)]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
});

test("expired tokens, invalid inputs, and mismatched passwords do not change the password", async () => {
  const s = setup();
  assert.equal((await s.forgot({ email: "bad-email" })).status, 400);
  assert.equal((await s.forgot(null)).status, 400);
  await s.forgot({ email: s.user.email });
  const token = s.getToken();
  for (const [password, confirmPassword] of [["short", "short"], ["new-password", "different"], ["😀".repeat(30), "😀".repeat(30)]]) {
    assert.equal((await s.reset({ token, password, confirmPassword })).status, 400);
  }
  s.user.passwordResetExpiresAt = new Date(Date.now() - 1000);
  assert.equal((await s.reset({ token, password: "new-password", confirmPassword: "new-password" })).status, 400);
  assert.equal(s.user.passwordHash, "old");
});

test("delivery failure clears the token and allows retry without revealing account existence", async () => {
  const s = setup();
  s.failDelivery();
  const response = await s.forgot({ email: s.user.email });
  assert.equal(response.status, 200);
  assert.equal(s.user.passwordResetTokenHash, null);
  assert.equal(s.user.passwordResetRequestedAt, null);
});

test("missing delivery configuration fails consistently for every account", async () => {
  const s = setup();
  delete s.env.RESEND_API_KEY;
  assert.equal((await s.forgot({ email: s.user.email })).status, 503);
  assert.equal((await s.forgot({ email: "unknown@example.com" })).status, 503);
  assert.equal(s.emails.length, 0);
});
