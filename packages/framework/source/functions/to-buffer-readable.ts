import { Readable, ReadableOptions } from "stream";

class BufferReadable extends Readable {
  protected _buffer: Buffer;

  public constructor(
    input: ArrayBuffer | NodeJS.TypedArray | string,
    options?: ReadableOptions,
  ) {
    super(Object.assign({}, options));

    if (ArrayBuffer.isView(input)) {
      const { buffer, byteLength, byteOffset } = input;
      this._buffer = Buffer.from(buffer, byteOffset, byteLength);
    } else if (input instanceof ArrayBuffer) {
      this._buffer = Buffer.from(input);
    } else {
      this._buffer = Buffer.from(input, "utf8");
    }
  }

  public _read(size: number): void {
    if (this._buffer.length > size) {
      const chunk = this._buffer.subarray(0, size);
      this._buffer = this._buffer.subarray(size);
      this.push(chunk);
    } else {
      this.push(this._buffer);
      this.push(null);
    }
  }
}

export function toBufferReadable(
  input: ArrayBuffer | NodeJS.TypedArray | string,
  options?: ReadableOptions,
): Readable {
  return new BufferReadable(input, options);
}
