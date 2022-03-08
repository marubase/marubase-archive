import { Readable } from "stream";

export async function toTextData(
  readable: Readable,
  encoding: BufferEncoding = "utf8",
): Promise<string> {
  let text = "";
  readable.setEncoding(encoding);
  for await (const part of readable) text += part;
  return text;
}
