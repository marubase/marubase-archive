import { Readable, ReadableOptions } from "stream";

class RequestReadable extends Readable {
  protected _reader?: AsyncIterator<Buffer>;

  protected _request: Request;

  public constructor(
    input: Omit<Request, "method" | "path" | "protocol">,
    options?: ReadableOptions,
  ) {
    super(Object.assign({}, options));

    const DEFAULT_REQUEST = { method: "GET", path: "/", protocol: "HTTP/1.1" };
    this._request = Object.assign(DEFAULT_REQUEST, input);
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
    } else {
      const { body } = this._request;
      this._reader = body[Symbol.asyncIterator]();

      const { method, path, protocol } = this._request;
      const rawRequest = `${method.toUpperCase()} ${path} ${protocol.toUpperCase()}\r\n`;
      this.push(rawRequest);

      const { headers } = this._request;
      for (const [key, value] of [...headers.entries()].sort()) {
        const rawHeader = `${key}: ${value}\r\n`;
        this.push(rawHeader);
      }

      const separator = `\r\n`;
      this.push(separator);
    }
  }
}

export function toRequestReadable(
  input: Omit<Request, "method" | "path" | "protocol">,
  options?: ReadableOptions,
): Readable {
  return new RequestReadable(input, options);
}

export type Request = {
  body: Readable;
  headers: Map<string, string>;
  method: string;
  path: string;
  protocol: string;
};
