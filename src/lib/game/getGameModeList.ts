import * as fs from "fs/promises";
import path from "path";

export default async function getGameModeList(): Promise<string[]> {
  return await fs.readdir(path.join(__dirname, "mode"));
}
