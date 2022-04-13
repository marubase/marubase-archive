import { Readable, ReadableOptions } from "stream";

class RequestReadable extends Readable {
  protected _reader?: AsyncIterator<Buffer>;

  protected _request: RequestRecord;

  public constructor(request: RequestRecord, options?: ReadableOptions) {
    super({ ...options, objectMode: false });
    this._request = request;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
      return;
    }

    const { method, protocol, url } = this._request;
    const requestLine = `${method} ${url.pathname}${url.search} ${protocol}\r\n`;
    this.push(requestLine);

    const hostHeader = `Host: ${url.hostname}\r\n`;
    this.push(hostHeader);

    const { body, headers } = this._request;
    this._reader = body[Symbol.asyncIterator]();

    headers.delete("Host"), headers.delete("host");
    for (const [key, value] of headers.entries()) {
      const rawHeader = `${key}: ${value}\r\n`;
      this.push(rawHeader);
    }

    const separator = `\r\n`;
    this.push(separator);
  }
}

export function toRequestReadable(
  request: RequestRecord,
  options?: ReadableOptions,
): Readable {
  return new RequestReadable(request, options);
}

export type RequestRecord = {
  body: Readable;
  headers: Map<string, string>;
  method: string;
  protocol: string;
  url: URL;
};
