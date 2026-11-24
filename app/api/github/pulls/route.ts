import {getServerSession} from "next-auth/next";
import {authOptions} from "@/auth"
import { getGitHubClient } from "@/lib/github";



export async function GET(request: Request) {
  try {

    const session = await getServerSession(authOptions);

if (!session?.user) {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

    const { searchParams } = new URL(request.url);

    const owner = searchParams.get("owner")?.trim();
    const repo = searchParams.get("repo")?.trim();

    // 1. Validate query parameters
    if (!owner || !repo) {
      return Response.json(
        { error: "owner and repo are required" },
        { status: 400 }
      );
    }

    // 2. Get GitHub client
    const octokit = await getGitHubClient();

    // 3. Fetch repository pull requests
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        state: "open",
        per_page: 100,
      }
    );

    // 4. Return pull requests
    return Response.json(data);

  } catch (error) {
    console.error("GitHub API Error:", error);

    return Response.json(
      { error: "Failed to fetch pull requests" },
      { status: 500 }
    );
  }
}