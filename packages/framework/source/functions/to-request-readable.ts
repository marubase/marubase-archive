import { Readable, ReadableOptions } from "stream";

class RequestReadable extends Readable {
  protected _reader?: AsyncIterator<Buffer>;

  protected _request: RawRequest;

  public constructor(input: RawRequestInput, options?: ReadableOptions) {
    super(Object.assign({}, options));

    const DEFAULT_REQUEST = {
      method: "GET",
      protocol: "HTTP/1.1",
      url: new URL("http://127.0.0.1/"),
    };
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

      const method = this._request.method.toUpperCase();
      const path = this._request.url.pathname;
      const protocol = this._request.protocol.toUpperCase();
      const requestLine = `${method} ${path} ${protocol}\r\n`;
      this.push(requestLine);

      const { hostname } = this._request.url;
      const hostHeader = `Host: ${hostname}\r\n`;
      this.push(hostHeader);

      const { headers } = this._request;
      headers.delete("Host");

      for (const [key, value] of headers.entries()) {
        const rawHeader = `${key}: ${value}\r\n`;
        this.push(rawHeader);
      }

      const separator = `\r\n`;
      this.push(separator);
    }
  }
}

export function toRequestReadable(
  input: RawRequestInput,
  options?: ReadableOptions,
): Readable {
  return new RequestReadable(input, options);
}

export type RawRequest = Required<RawRequestInput>;

export type RawRequestInput = {
  body: Readable;
  headers: Map<string, string>;
  method?: string;
  protocol?: string;
  url?: URL;
};
