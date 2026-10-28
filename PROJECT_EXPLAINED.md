# ShipSafer — Simple Project Guide

ShipSafer aims to check a preview version of a website before it goes live. The app currently has a landing page, sign-in screens, a GitHub dashboard, and basic API checks. The full checking process is still unfinished.

## How it works

1. Open the home page.
2. Use Google or GitHub on `/signup` to sign in, then reach `/dashboard`.
3. The dashboard asks the server for GitHub repositories and open pull requests (proposed code changes).
4. The server uses GitHub App credentials to get that data from GitHub.

GitHub sign-in identifies the user. A GitHub App installation gives the server access to repositories. These are separate connections; the app does not yet link installations to individual users.

## Main files and folders

| Location | Purpose |
| --- | --- |
| `app/` | Pages and server API endpoints |
| `app/layout.tsx` | Shared page wrapper, styles, navigation, and sign-in session |
| `app/dashboard/components/` | Dashboard, sidebar, pull requests, and repository list |    
| `components/auth/AuthPage.tsx` | Login and signup screens |
| `components/pages/Hero.tsx` | Landing-page content |
| `components/ui/` | Reusable buttons, inputs, and cards |
| `lib/github.ts` | Connects the server to GitHub |
| `auth.ts` | Google and GitHub sign-in settings |
| `public/` | Images and fonts |

Built with Next.js, React, TypeScript, Tailwind CSS, NextAuth, and Octokit (a GitHub API library).

## What works and what is missing

- **Dashboard:** Loads repositories and open pull requests. It uses one configured GitHub installation and a fixed repository for pull requests; choosing a repository is not implemented.
- **Sign-in:** Google/GitHub authentication is configured and needs valid credentials. Password login, account creation, and password reset are unfinished. Logout currently only opens the login page.
- **Recent Activity:** Shows placeholder text.
- **GitHub webhook:** Receives and logs events. It does not verify their signature or start checks.
- **API checks:** Request `/api/health`, `/api/users`, and `/api/products` on a supplied preview URL. They report HTTP success and response time, without validating response contents.
- **Full check flow:** Intended to find a preview from a commit, check pages, then check APIs. Preview lookup and page-check endpoints are missing, and the runner does not return API results.
- **Other gaps:** No saved check history, results posted back to GitHub, or session protection for dashboard/data routes.

## Run locally

Add provider credentials to `.env.local`: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, and `AUTH_SECRET`. For repository access, also set `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, and `GITHUB_INSTALLATION_ID`.

```sh
npm ci
npm run dev
```

Open the local address printed by the server. Use `npm run lint` to check code and `npm run build` to create a production build.

This guide summarizes the code inspected on September 27, 2026. Authentication and external checks were not tested for that walkthrough.
