import { Readable } from "stream";
import { toTextData } from "./to-text-data.js";

type JsonData =
  | { [key: string]: JsonData }
  | JsonData[]
  | boolean
  | null
  | number
  | string;

export async function toJsonData(readable: Readable): Promise<JsonData> {
  const json = await toTextData(readable, "utf8");
  return JSON.parse(json);
}
