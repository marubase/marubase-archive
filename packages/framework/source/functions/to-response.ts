import { Readable } from "stream";
import { MAX_HEADER_SIZE } from "./to-message.js";
import { RawResponse } from "./to-response-readable.js";

export async function toResponse(readable: Readable): Promise<RawResponse> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  let protocol = "HTTP/1.1";
  let statusCode = "200";
  let statusText = "OK";
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);
    if (buffer.length > MAX_HEADER_SIZE) {
      const context = `Parsing http response stream.`;
      const problem = `No header found at the first ${MAX_HEADER_SIZE} bytes.`;
      const solution = `Please supply a valid http response.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const separator = "\r\n\r\n";
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headersBlock = buffer.subarray(0, separatorIndex).toString("utf8");
    const rawHeaders = headersBlock.split("\r\n");

    const match = rawHeaders[0].match(/^(HTTP\/.+)\s([1-5][0-9]{2})\s(.+)$/);
    if (!match) {
      const context = `Parsing http response stream.`;
      const problem = `No response line found.`;
      const solution = `Please supply a valid http response.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }
    protocol = match[1].toUpperCase();
    statusCode = match[2];
    statusText = match[3];

    for (let i = 1; i < rawHeaders.length; i++) {
      const [key, value] = rawHeaders[i].split(":");
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
  return { body, headers, protocol, statusCode, statusText };
}
