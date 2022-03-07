import { Writable } from "stream";

export function isWritableStream(input: unknown): input is Writable {
  return (
    typeof input === "object" &&
    input !== null &&
    "cork" in (input as Writable) &&
    "destroy" in (input as Writable) &&
    "end" in (input as Writable) &&
    "setDefaultEncoding" in (input as Writable) &&
    "uncork" in (input as Writable) &&
    "write" in (input as Writable)
  );
}
