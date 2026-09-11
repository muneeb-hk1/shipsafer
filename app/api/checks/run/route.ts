export async function POST(req: Request) {
  try {
    const { sha } = await req.json();

    if (!sha) {
      return Response.json(
        { error: "sha is required" },
        { status: 400 }
      );
    }

    // 1. Get preview URL
    const previewRes = await fetch(
      `http://localhost:3000/api/vercel/preview?sha=${sha}`
    );

    const previewData = await previewRes.json();

    if (!previewRes.ok || !previewData.url) {
      return Response.json(
        {
          error: "Preview deployment not found",
          details: previewData,
        },
        { status: 404 }
      );
    }

    // 2. Run page checks
    const pageCheckRes = await fetch(
      "http://localhost:3000/api/checks/pages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previewUrl: previewData.url,
        }),
      }
    );

    const pageCheckData = await pageCheckRes.json();

    // 3. Return everything together
    return Response.json({
      sha,
      previewUrl: previewData.url,
      previewStatus: previewData.status,
      pageChecks: pageCheckData.results,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}