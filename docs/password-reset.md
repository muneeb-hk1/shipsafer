# Password reset setup

The login page’s “Forgot password?” form emails a link to `/reset-password`. The link expires after 30 minutes and works once. Requesting another link replaces the previous link; requests within 60 seconds are ignored. Only a SHA-256 hash of the random token is stored. Passwords use bcrypt, matching sign-in.

Set these server environment variables in `.env.local` and your hosting provider:

```dotenv
RESEND_API_KEY=re_your_api_key
EMAIL_FROM="ShipSafer <no-reply@your-verified-domain.com>"
APP_URL=http://localhost:3000
```

Use your public HTTPS URL for `APP_URL` in production. If omitted, `NEXTAUTH_URL` is used. Never expose the API key through a `NEXT_PUBLIC_` variable. Use a sender address from a domain verified in Resend. See [Resend's send email documentation](https://resend.com/docs/api-reference/emails/send-email).

Apply the database migration and regenerate the client using the installed Prisma version:

```sh
npx prisma migrate deploy
npx prisma generate
```

Restart the development server after setting environment variables and regenerating the client.

To verify delivery, register an email/password account you control, request a reset, open the email link, enter matching passwords, and log in with the new password. The old password and reused or expired links should fail. Unknown emails receive the same request confirmation as registered accounts. Email delivery failures are logged server-side without exposing addresses or tokens.
