import { Readable, ReadableOptions } from "stream";

export class BufferStream extends Readable {
  protected _buffer: Buffer;

  public constructor(
    input: ArrayBuffer | NodeJS.TypedArray | string,
    options: ReadableOptions,
  ) {
    super({ ...options });
    if (ArrayBuffer.isView(input)) {
      const { buffer, byteLength, byteOffset } = input;
      this._buffer = Buffer.from(buffer, byteOffset, byteLength);
    } else if (input instanceof ArrayBuffer) {
      this._buffer = Buffer.from(input);
    } else {
      this._buffer = Buffer.from(input, "utf8");
    }
  }

  public _read(): void {
    this.push(this._buffer);
    this.push(null);
  }
}
