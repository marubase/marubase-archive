import { Readable, ReadableOptions } from "stream";

class BufferReadable extends Readable {
  protected _buffer: Buffer;

  public constructor(
    bufferLike: ArrayBuffer | NodeJS.TypedArray | string,
    options?: ReadableOptions,
  ) {
    super({ ...options, objectMode: false });
    if (ArrayBuffer.isView(bufferLike)) {
      const { buffer, byteOffset, byteLength } = bufferLike;
      this._buffer = Buffer.from(buffer, byteOffset, byteLength);
    } else if (bufferLike instanceof ArrayBuffer) {
      this._buffer = Buffer.from(bufferLike);
    } else {
      this._buffer = Buffer.from(bufferLike, "utf8");
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
  bufferLike: ArrayBuffer | NodeJS.TypedArray | string,
  options?: ReadableOptions,
): Readable {
  return new BufferReadable(bufferLike, options);
}
