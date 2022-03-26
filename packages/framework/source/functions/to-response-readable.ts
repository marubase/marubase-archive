import { Readable, ReadableOptions } from "stream";

class ResponseReadable extends Readable {
  protected _reader?: AsyncIterator<Buffer>;

  protected _response: RawResponse;

  public constructor(input: RawResponseInput, options?: ReadableOptions) {
    super(Object.assign({}, options));

    const DEFAULT_RESPONSE = {
      protocol: "HTTP/1.1",
      statusCode: "200",
      statusText: "OK",
    };
    this._response = Object.assign(DEFAULT_RESPONSE, input);
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
    } else {
      const { body } = this._response;
      this._reader = body[Symbol.asyncIterator]();

      const { protocol, statusCode, statusText } = this._response;
      const responseLine = `${protocol.toUpperCase()} ${statusCode} ${statusText}\r\n`;
      this.push(responseLine);

      const { headers } = this._response;
      for (const [key, value] of headers.entries()) {
        const rawHeader = `${key}: ${value}\r\n`;
        this.push(rawHeader);
      }

      const separator = `\r\n`;
      this.push(separator);
    }
  }
}

export function toResponseReadable(
  input: RawResponseInput,
  options?: ReadableOptions,
): Readable {
  return new ResponseReadable(input, options);
}

export type RawResponse = Required<RawResponseInput>;

export type RawResponseInput = {
  body: Readable;
  headers: Map<string, string>;
  protocol?: string;
  statusCode?: string;
  statusText?: string;
};
