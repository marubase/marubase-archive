import { Readable, ReadableOptions } from "stream";

class MessageReadable extends Readable {
  protected _message: Message;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(input: Message, options?: ReadableOptions) {
    super(Object.assign({}, options));
    this._message = input;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
    } else {
      const { body, headers } = this._message;
      this._reader = body[Symbol.asyncIterator]();

      for (const [key, value] of [...headers.entries()].sort()) {
        const rawHeader = `${key}: ${value}\r\n`;
        this.push(rawHeader);
      }

      const separator = `\r\n`;
      this.push(separator);
    }
  }
}

export function toMessageReadable(
  input: Message,
  options?: ReadableOptions,
): Readable {
  return new MessageReadable(input, options);
}

export type Message = {
  body: Readable;
  headers: Map<string, string>;
};
