import { Readable } from "stream";

export async function toCollection<T>(readable: Readable): Promise<Array<T>> {
  const collection: T[] = [];
  for await (const item of readable) collection.push(item);
  return collection;
}
