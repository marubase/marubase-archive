import { Readable, ReadableOptions } from "stream";

function isAsyncIterable<T>(input: unknown): input is AsyncIterable<T> {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.asyncIterator in (input as AsyncIterable<T>)
  );
}

function isIterable<T>(input: unknown): input is Iterable<T> {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.iterator in (input as Iterable<T>)
  );
}

export class IteratorStream extends Readable {
  protected _iterator: AsyncIterator<unknown> | Iterator<unknown>;

  public constructor(
    input:
      | Array<unknown>
      | AsyncIterable<unknown>
      | AsyncIterator<unknown>
      | Iterable<unknown>
      | Iterator<unknown>,
    options: ReadableOptions,
  ) {
    super({ ...options, objectMode: true });

    if (Array.isArray(input)) {
      this._iterator = input.values();
    } else if (isAsyncIterable(input)) {
      this._iterator = input[Symbol.asyncIterator]();
    } else if (isIterable(input)) {
      this._iterator = input[Symbol.iterator]();
    } else {
      this._iterator = input;
    }
  }

  public _read(): void {
    Promise.resolve(this._iterator.next()).then(
      (chunk) => this.push(!chunk.done ? chunk.value : null),
      (error) => this.destroy(error),
    );
  }
}
