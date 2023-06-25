import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

let client: PrismaClient | null = null;
export const getClient = () => {
  if (client) {
    return client;
  }
  const dbPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../",
    "potato.db"
  );
  return new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
  });
};
