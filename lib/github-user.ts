import { Octokit } from "octokit";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/token-encryption";

export class GitHubConnectionError extends Error {
  constructor(
    public readonly code:
      | "GITHUB_CONNECTION_REQUIRED"
      | "GITHUB_RECONNECT_REQUIRED"
  ) {
    super(code);
    this.name = "GitHubConnectionError";
  }
}

export async function getGitHubClientForUser(userId: string) {
  const connection = await prisma.gitHubConnection.findUnique({
    where: { userId },
    select: {
      githubUserId: true,
      encryptedAccessToken: true,
      accessTokenExpiresAt: true,
    },
  });

  if (!connection) {
    throw new GitHubConnectionError("GITHUB_CONNECTION_REQUIRED");
  }

  if (
    connection.accessTokenExpiresAt &&
    connection.accessTokenExpiresAt.getTime() <= Date.now()
  ) {
    throw new GitHubConnectionError("GITHUB_RECONNECT_REQUIRED");
  }

  const token = decryptToken(connection.encryptedAccessToken);

  const octokit = new Octokit({
    auth: token,
  });

  // Confirm the token belongs to the saved GitHub identity.
  const { data: githubUser } = await octokit.request("GET /user");

  if (String(githubUser.id) !== connection.githubUserId) {
    throw new GitHubConnectionError("GITHUB_RECONNECT_REQUIRED");
  }

  return octokit;
}