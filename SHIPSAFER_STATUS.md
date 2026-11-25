# ShipSafer Status

Updated: **19 November 2026**

**Status:** Partly built. The main preview-checking feature is still unfinished, so the app is not ready for public release.

## Completed

These features are implemented; full live testing is still pending.

- [x] Landing page, navigation, and dashboard layout.
- [x] Signup, password login, logout, and login protection for the dashboard.
- [x] Google/GitHub login configuration and password-reset flow.
- [x] GitHub repository list, repository selection, and automatic pull-request refresh.
- [x] Login checks on repository and open pull-request APIs.
- [x] Prisma/PostgreSQL setup. Local database connection and Prisma Studio were checked successfully.

## Pending

- [ ] Give each user access only to their own GitHub repositories; protect remaining APIs and verify webhook signatures.
- [ ] Find preview deployments and run page/API checks safely, with time limits.
- [ ] Save check results, show real activity/history, and report results to GitHub.
- [ ] Fix lint issues and confirm a production build works.
- [ ] Test real signup/login, Google/GitHub login, reset emails, database migrations, and GitHub data loading.
- [ ] Finish mobile/accessibility checks, pagination, setup docs, and automated release checks.

## Latest checks

- TypeScript: **passed**.
- Password-reset tests: **7/7 passed** with simulated database/email services.
- Lint: **5 errors, 3 warnings**.
- Production build: **not rechecked**; earlier attempt failed to download fonts.

**Next step:** Fix lint, secure GitHub access, then finish the preview-checking workflow.
