import { Readable, ReadableOptions } from "stream";
import { BufferStream } from "./buffer-stream.js";
import { IteratorStream } from "./iterator-stream.js";

function isBuffer(
  input: unknown,
): input is ArrayBuffer | NodeJS.TypedArray | string {
  return (
    ArrayBuffer.isView(input) ||
    input instanceof ArrayBuffer ||
    typeof input === "string"
  );
}

function isIterator(
  input: unknown,
): input is
  | Array<unknown>
  | AsyncIterable<unknown>
  | AsyncIterator<unknown>
  | Iterable<unknown>
  | Iterator<unknown> {
  return (
    Array.isArray(input) ||
    Symbol.asyncIterator in (input as AsyncIterable<unknown>) ||
    Symbol.iterator in (input as Iterable<unknown>) ||
    "next" in (input as AsyncIterator<unknown> | Iterator<unknown>)
  );
}

export function toReadable(
  input: unknown,
  options?: ReadableOptions,
): Readable {
  if (isBuffer(input)) return new BufferStream(input, options);
  if (isIterator(input)) return new IteratorStream(input, options);

  const context = `Creating readable stream.`;
  const problem = `Input is not of type Array, ArrayBuffer, AsyncIterable AsyncIterator, Iterable, Iterator, TypedArray, or string.`;
  const solution = `Please provide the correct input type.`;
  throw new TypeError(`${context} ${problem} ${solution}`);
}
