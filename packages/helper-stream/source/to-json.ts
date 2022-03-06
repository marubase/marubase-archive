import { Readable } from "stream";
import { toText } from "./to-text.js";

export async function toJSON(stream: Readable): Promise<JsonData> {
  const json = await toText(stream, "utf8");
  return JSON.parse(json);
}

export type JsonData =
  | { [key: string]: JsonData }
  | JsonData[]
  | boolean
  | null
  | number
  | string;
