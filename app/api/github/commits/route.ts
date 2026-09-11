import { getGitHubClient } from "@/lib/github";

export async function GET() {
  try {
    const octokit = await getGitHubClient();

    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: "muneeb-hk1",
        repo: "ziina",
        per_page: 15,
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