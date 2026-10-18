export async function POST(req: Request) {
  try {
    const { previewUrl } = await req.json();

    if (!previewUrl) {
      return Response.json(
        { error: "previewUrl is required" },
        { status: 400 }
      );
    }

    const apiRoutes = [
      "/api/health",
      "/api/users",
      "/api/products",
    ];

    const results = await Promise.all(
      apiRoutes.map(async (path) => {
        const start = Date.now();

        try {
          const res = await fetch(`${previewUrl}${path}`);

          const responseTime = Date.now() - start;

          return {
            path,
            status: res.status,
            responseTime,
            passed: res.ok,
          };
        } catch {
          return {
            path,
            status: 0,
            responseTime: 0,
            passed: false,
          };
        }
      })
    );

    return Response.json({
      previewUrl,
      results,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}