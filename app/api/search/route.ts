import { getClient } from "../db";

let i = 1;
export async function GET(request: Request) {
  const client = await getClient();
  const query = new URL(request.url).searchParams.get("query");

  if (!query) {
    return new Response("No query provided", { status: 400 });
  }

  const comms = await client.community.findMany({
    take: 10,
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { title: { contains: query } },
      ],
    },
    orderBy: { countSubscribers: "desc" },
  });
  return new Response(JSON.stringify([...comms]));
}