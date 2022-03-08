import { Readable } from "stream";

export async function toBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) chunks.push(chunk);
  return Buffer.concat(chunks);
}
