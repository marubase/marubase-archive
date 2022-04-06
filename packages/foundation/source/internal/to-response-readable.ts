import { Readable, ReadableOptions } from "stream";

class ResponseReadable extends Readable {
  protected _reader?: AsyncIterator<Buffer>;

  protected _response: ResponseRecord;

  public constructor(response: ResponseRecord, options?: ReadableOptions) {
    super({ ...options, objectMode: false });
    this._response = response;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
      return;
    }

    const { protocol, statusCode, statusText } = this._response;
    const responseLine = `${protocol} ${statusCode} ${statusText}\r\n`;
    this.push(responseLine);

    const { body, headers } = this._response;
    this._reader = body[Symbol.asyncIterator]();

    for (const [key, value] of headers.entries()) {
      const rawHeader = `${key}: ${value}\r\n`;
      this.push(rawHeader);
    }

    const separator = `\r\n`;
    this.push(separator);
  }
}

export function toResponseReadable(
  response: ResponseRecord,
  options?: ReadableOptions,
): Readable {
  return new ResponseReadable(response, options);
}

export type ResponseRecord = {
  body: Readable;
  headers: Map<string, string>;
  protocol: string;
  statusCode: number;
  statusText: string;
};
