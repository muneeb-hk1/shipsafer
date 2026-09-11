import { getGitHubClient } from "@/lib/github";

export async function GET() {
  try {
    const octokit = await getGitHubClient();

    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner: "muneeb-hk1",
        repo: "ziina",
        state: "open",
      }
    );

    return Response.json(data);
  } catch (error: any) {
    console.error("FULL GITHUB ERROR:", error);

    return Response.json(
      {
        error: error.message,
        status: error.status,
      },
      { status: 500 }
    );
  }
}