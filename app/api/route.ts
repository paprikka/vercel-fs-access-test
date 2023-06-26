import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
export async function GET(request: Request) {
  const dbPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../",
    "potato.db"
  );
  const client = new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
  });

  try {
    const communities = await client.community.findMany({
      orderBy: { countSubscribers: "desc" },
      take: 10,
    });
    //   const test = await readFile("./potato.txt", "utf8");
    return new Response(JSON.stringify({ dbPath, communities }, null, 2));
  } catch (error) {
    return new Response((error as unknown as Error)?.message);
  }
}
