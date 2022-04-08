import { Readable } from "stream";
import { MAX_HEADERS_SIZE } from "./to-message.js";
import { RequestRecord } from "./to-request-readable.js";

export async function toRequest(readable: Readable): Promise<RequestRecord> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();

  const url = new URL("http://127.0.0.1/");
  let method = "GET";
  let protocol = "HTTP/1.1";

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);
    if (buffer.length > MAX_HEADERS_SIZE) {
      const context = `Parsing request readable.`;
      const problem = `No headers found in the first ${MAX_HEADERS_SIZE} bytes.`;
      const solution = `Please parse a valid request readable.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const separator = `\r\n\r\n`;
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headersBuffer = buffer.subarray(0, separatorIndex);
    const headersText = headersBuffer.toString("utf8");
    const rawHeaders = headersText.split("\r\n");

    const requestLinePattern = /^(.+)\s+(.+)\s+(HTTP\/.+)$/;
    const requestLine = rawHeaders[0].match(requestLinePattern);
    if (!requestLine) {
      const context = `Parsing request readable.`;
      const problem = `No request line found.`;
      const solution = `Please parse a valid request readable.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }
    rawHeaders.shift();

    for (const rawHeader of rawHeaders) {
      const [key, value] = rawHeader.split(":");
      headers.set(key.trim(), value.trim());
    }

    if (headers.has("Host")) url.hostname = headers.get("Host") as string;

    const [pathname, search] = requestLine[2].split("?");
    if (search) url.search = search;
    url.pathname = pathname;

    method = requestLine[1];
    protocol = requestLine[3];

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
  return { body, headers, method, protocol, url };
}
