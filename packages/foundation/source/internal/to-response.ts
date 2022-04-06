import { Readable } from "stream";
import { MAX_HEADERS_SIZE } from "./to-message.js";
import { ResponseRecord } from "./to-response-readable.js";

export async function toResponse(readable: Readable): Promise<ResponseRecord> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();

  let protocol = "HTTP/1.1";
  let statusCode = 200;
  let statusText = "OK";

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);
    if (buffer.length > MAX_HEADERS_SIZE) {
      const context = `Parsing response readable.`;
      const problem = `No headers found in the first ${MAX_HEADERS_SIZE} bytes.`;
      const solution = `Please parse a valid response readable.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const separator = `\r\n\r\n`;
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headersBuffer = buffer.subarray(0, separatorIndex);
    const headersText = headersBuffer.toString("utf8");
    const rawHeaders = headersText.split("\r\n");

    const responseLinePattern = /^(HTTP\/.+)\s+([0-9]+)\s+(.+)$/;
    const responseLine = rawHeaders[0].match(responseLinePattern);
    if (!responseLine) {
      const context = `Parsing response readable.`;
      const problem = `No response line found.`;
      const solution = `Please parse a valid response readable.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }
    rawHeaders.shift();

    for (const rawHeader of rawHeaders) {
      const [key, value] = rawHeader.split(":");
      headers.set(key.trim(), value.trim());
    }

    protocol = responseLine[1];
    statusCode = parseInt(responseLine[2]);
    statusText = responseLine[3];

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
  return { body, headers, protocol, statusCode, statusText };
}
