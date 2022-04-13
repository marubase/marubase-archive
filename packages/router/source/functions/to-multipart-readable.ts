import { Readable, ReadableOptions } from "stream";

class MultipartReadable extends Readable {
  protected _iterator: Iterator<Readable>;

  protected _multipart: MultipartRecord;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(multipart: MultipartRecord, options?: ReadableOptions) {
    super({ ...options, objectMode: false });
    this._multipart = multipart;
    this._iterator = multipart.parts.values();

    const { preamble } = this._multipart;
    this.push(preamble);
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => {
          if (chunk.done) delete this._reader, this.push(Buffer.from([]));
          else this.push(chunk.value);
        },
        (error) => this.destroy(error),
      );
      return;
    }

    const { boundary } = this._multipart;
    const delimiter = `\r\n--${boundary}`;

    const cursor = this._iterator.next();
    if (cursor.done) {
      const closeDelimiter = `${delimiter}--`;
      this.push(closeDelimiter);

      const { epilogue } = this._multipart;
      this.push(epilogue);
      this.push(null);
      return;
    }

    const openDelimiter = `${delimiter}\r\n`;
    this.push(openDelimiter);

    this._reader = cursor.value[Symbol.asyncIterator]();
  }
}

export function toMultipartReadable(
  multipart: MultipartRecord,
  options?: ReadableOptions,
): Readable {
  return new MultipartReadable(multipart, options);
}

export type MultipartRecord = {
  boundary: string;
  epilogue: string;
  parts: Readable[];
  preamble: string;
};
