import { Readable, ReadableOptions } from "stream";

class CollectionReadable extends Readable {
  protected _iterator: AsyncIterator<unknown> | Iterator<unknown>;

  public constructor(
    input:
      | Array<unknown>
      | AsyncIterable<unknown>
      | AsyncIterator<unknown>
      | Iterable<unknown>
      | Iterator<unknown>,
    options?: ReadableOptions,
  ) {
    super(Object.assign({}, options, { objectMode: true }));

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

function isAsyncIterable(input: unknown): input is AsyncIterable<unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.asyncIterator in (input as AsyncIterable<unknown>)
  );
}

function isIterable(input: unknown): input is Iterable<unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.iterator in (input as Iterable<unknown>)
  );
}

export function toCollectionReadable(
  input:
    | Array<unknown>
    | AsyncIterable<unknown>
    | AsyncIterator<unknown>
    | Iterable<unknown>
    | Iterator<unknown>,
  options?: ReadableOptions,
): Readable {
  return new CollectionReadable(input, options);
}
