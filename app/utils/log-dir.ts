import fs from "fs";
import path from "path";

export const logDir = (filePath: string) => {
  const dir = path.join(process.cwd(), filePath);
  fs.readdir(dir, (err, files) => {
    console.log(files);
    if (err) {
      console.log(err);
    }
  });
};
