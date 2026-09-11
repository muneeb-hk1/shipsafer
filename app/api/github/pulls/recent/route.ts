import { getGitHubClient } from "@/lib/github";

export async function GET() {
  try {
    const octokit = await getGitHubClient();

    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner: "muneeb-hk1",
        repo: "ziina",
        state: "all",
        per_page: 15,
        sort: "updated",
        direction: "desc",
      }
    );

    return Response.json(data);
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}