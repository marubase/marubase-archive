import { Readable, ReadableOptions } from "stream";

class MessageReadable extends Readable {
  protected _message: MessageRecord;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(message: MessageRecord, options?: ReadableOptions) {
    super({ ...options, objectMode: false });
    this._message = message;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
      return;
    }

    const { body, headers } = this._message;
    this._reader = body[Symbol.asyncIterator]();

    for (const [key, value] of headers.entries()) {
      const rawHeader = `${key}: ${value}\r\n`;
      this.push(rawHeader);
    }

    const separator = `\r\n`;
    this.push(separator);
  }
}

export function toMessageReadable(
  message: MessageRecord,
  options?: ReadableOptions,
): Readable {
  return new MessageReadable(message, options);
}

export type MessageRecord = {
  body: Readable;
  headers: Map<string, string>;
};
