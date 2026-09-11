import { App } from "octokit";

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});

export async function getGitHubClient() {
  return app.getInstallationOctokit(
    Number(process.env.GITHUB_INSTALLATION_ID)
  );
}