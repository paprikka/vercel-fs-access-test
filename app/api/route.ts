import { logDir } from "../utils/log-dir";
import { getClient } from "./db";
export async function GET(request: Request) {
  logDir("/vercel/path0/app/");

  const client = getClient();

  try {
    const communities = await client.community.findMany({
      orderBy: { countSubscribers: "desc" },
      take: 10,
    });
    //   const test = await readFile("./potato.txt", "utf8");
    return new Response(JSON.stringify({ communities }, null, 2));
  } catch (error) {
    return new Response((error as unknown as Error)?.message);
  }
}
