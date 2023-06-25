import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
export async function GET(request: Request) {
  // read potato.txt from the path of this module
  try {
    const test = await readFile(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "potato.txt"),
      "utf8"
    );
    //   const test = await readFile("./potato.txt", "utf8");
    return new Response(test);
  } catch (error) {
    return new Response((error as unknown as Error)?.message);
  }
}
