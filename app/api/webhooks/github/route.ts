export async function POST(req: Request) {
  const event = req.headers.get("x-github-event");
  const body = await req.json();

  console.log("GitHub event:", event);
  console.log("Action:", body.action);

  if (event === "pull_request") {
    console.log({
      number: body.pull_request.number,
      title: body.pull_request.title,
      branch: body.pull_request.head.ref,
      base: body.pull_request.base.ref,
    });
  }

  return Response.json({ received: true });
}