import { Readable } from "stream";
import { RawMessage } from "./to-message-readable.js";

export const MAX_HEADER_SIZE = 16384;

export async function toMessage(readable: Readable): Promise<RawMessage> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);
    if (buffer.length > MAX_HEADER_SIZE) {
      const context = `Parsing http message stream.`;
      const problem = `No header found at the first ${MAX_HEADER_SIZE} bytes.`;
      const solution = `Please supply a valid http message.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const separator = "\r\n\r\n";
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headersBlock = buffer.subarray(0, separatorIndex).toString("utf8");
    for (const rawHeader of headersBlock.split("\r\n")) {
      const [key, value] = rawHeader.split(":");
      headers.set(key.trim(), value.trim());
    }
    buffer = buffer.subarray(separatorIndex + separator.length);
    break;
  }

  const body = new Readable({
    read() {
      reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
    },
  });
  body.push(buffer);
  return { body, headers };
}
