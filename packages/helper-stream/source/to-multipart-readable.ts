import { Readable, ReadableOptions } from "stream";

class MultipartReadable extends Readable {
  protected _boundary: string;

  protected _iterator: Iterator<Readable>;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(input: Multipart, options?: ReadableOptions) {
    super(Object.assign({}, options));
    this._boundary = input.boundary;
    this._iterator = input.parts[Symbol.iterator]();
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => {
          if (chunk.done) delete this._reader, this.push(Buffer.from("\r\n"));
          else this.push(chunk.value);
        },
        (error) => this.destroy(error),
      );
      return;
    }

    const cursor = this._iterator.next();
    if (cursor.done) {
      const ender = `--${this._boundary}--`;
      this.push(ender);
      this.push(null);
      return;
    }

    this._reader = cursor.value[Symbol.asyncIterator]();

    const starter = `--${this._boundary}\r\n`;
    this.push(starter);
  }
}

export function toMultipartReadable(
  input: Multipart,
  options?: ReadableOptions,
): Readable {
  return new MultipartReadable(input, options);
}

export type Multipart = {
  boundary: string;
  parts: Readable[];
};
