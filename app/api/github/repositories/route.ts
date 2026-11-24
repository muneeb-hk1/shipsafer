import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import {
  getGitHubClientForUser,
  GitHubConnectionError,
} from "@/lib/github-user";

export const runtime = "nodejs";

const responseHeaders = {
  "Cache-Control": "private, no-store",
};

type RepositoryItem = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  url: string;
  owner: string | undefined;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401, headers: responseHeaders }
      );
    }

    const octokit = await getGitHubClientForUser(session.user.id);

    const installations = await octokit.paginate(
      "GET /user/installations",
      { per_page: 100 }
    );

    const repositoriesById = new Map<number, RepositoryItem>();

    for (const installation of installations) {
      if (installation.suspended_at) {
        continue;
      }

      const repositories = await octokit.paginate(
        "GET /user/installations/{installation_id}/repositories",
        {
          installation_id: installation.id,
          per_page: 100,
        }
      );

      for (const repo of repositories) {
        repositoriesById.set(repo.id, {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          url: repo.html_url,
          owner: repo.owner?.login,
        });
      }
    }

    return Response.json(
      [...repositoriesById.values()],
      { headers: responseHeaders }
    );
  } catch (error: unknown) {
    if (error instanceof GitHubConnectionError) {
      return Response.json(
        { error: error.code },
        { status: 409, headers: responseHeaders }
      );
    }

    const upstreamStatus =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : undefined;

    if (upstreamStatus === 401) {
      return Response.json(
        { error: "GITHUB_RECONNECT_REQUIRED" },
        { status: 409, headers: responseHeaders }
      );
    }

    if (upstreamStatus === 403 || upstreamStatus === 429) {
      return Response.json(
        { error: "GitHub denied access or temporarily limited requests." },
        { status: upstreamStatus, headers: responseHeaders }
      );
    }

    // Avoid logging complete errors that may contain request credentials.
    console.error("Repository fetch failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      upstreamStatus,
    });

    return Response.json(
      { error: "Failed to fetch repositories" },
      { status: 500, headers: responseHeaders }
    );
  }
}