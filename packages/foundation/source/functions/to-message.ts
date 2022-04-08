import { Readable } from "stream";
import { MessageRecord } from "./to-message-readable.js";

export const MAX_HEADERS_SIZE = 16384;

export async function toMessage(readable: Readable): Promise<MessageRecord> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);
    if (buffer.length > MAX_HEADERS_SIZE) {
      const context = `Parsing message readable.`;
      const problem = `No headers found in the first ${MAX_HEADERS_SIZE} bytes.`;
      const solution = `Please parse a valid message readable.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const separator = `\r\n\r\n`;
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headersBuffer = buffer.subarray(0, separatorIndex);
    const headersText = headersBuffer.toString("utf8");
    for (const rawHeader of headersText.split("\r\n")) {
      const [key, value] = rawHeader.split(":");
      headers.set(key.trim(), value.trim());
    }

    buffer = buffer.subarray(separatorIndex + 2);
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

  body.push(buffer.subarray(2));
  return { body, headers };
}
