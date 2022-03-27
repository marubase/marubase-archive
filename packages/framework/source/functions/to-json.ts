import { Readable } from "stream";
import { toText } from "./to-text.js";

type JSONData =
  | { [key: string]: JSONData }
  | JSONData[]
  | boolean
  | null
  | number
  | string;

export async function toJSON(readable: Readable): Promise<JSONData> {
  const json = await toText(readable, "utf8");
  return JSON.parse(json);
}
