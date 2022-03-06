import { Readable } from "stream";

export async function toText(
  stream: Readable,
  encoding: BufferEncoding = "utf8",
): Promise<string> {
  let text = "";
  for await (const chunk of stream.setEncoding(encoding)) text += chunk;
  return text;
}
