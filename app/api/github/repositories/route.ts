import { getGitHubClient } from "@/lib/github";

export async function GET() {
  try {
    const octokit = await getGitHubClient();

    const { data } = await octokit.request(
      "GET /installation/repositories",
      {
        per_page: 100,
      }
    );

    const repositories = data.repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      owner: repo.owner.login,
    }));

    return Response.json(repositories);
  } catch (error: any) {
    console.error("Repository fetch error:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}