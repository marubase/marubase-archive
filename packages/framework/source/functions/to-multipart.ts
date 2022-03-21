import { Readable } from "stream";
import { toBufferReadable } from "./to-buffer-readable.js";

export async function* toMultipart(
  boundary: string,
  readable: Readable,
): AsyncIterableIterator<Readable> {
  const reader = readable[Symbol.asyncIterator]() as AsyncIterator<Buffer>;

  const starter = Buffer.from(`\r\n--${boundary}\r\n`);
  const ender = Buffer.from(`\r\n--${boundary}--`);

  const starterTail = Buffer.from("\r\n");
  const enderTail = Buffer.from("--");
  const separator = `--${boundary}`;

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  let offset = 0;
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const separatorIndex = buffer.indexOf(separator, offset);
    if (separatorIndex < 0) continue;

    const separatorTail = buffer.subarray(
      separatorIndex + separator.length,
      separatorIndex + separator.length + 2,
    );
    if (
      !separatorTail.equals(starterTail) &&
      !separatorTail.equals(enderTail)
    ) {
      if (separatorTail.length === 2)
        offset = separatorIndex + separator.length + 2;
      continue;
    }

    if (separatorTail.equals(enderTail)) return;

    buffer = buffer.subarray(separatorIndex + separator.length + 2);
    offset = 0;

    while (true) {
      const starterIndex = buffer.indexOf(starter);
      if (starterIndex >= 0) {
        const readable = toBufferReadable(buffer.subarray(0, starterIndex));
        buffer = buffer.subarray(starterIndex + starter.length);
        yield readable;
        continue;
      }

      const enderIndex = buffer.indexOf(ender);
      if (enderIndex >= 0) {
        const readable = toBufferReadable(buffer.subarray(0, enderIndex));
        buffer = buffer.subarray(enderIndex + ender.length);
        yield readable;
        return;
      }

      break;
    }

    let next: (error?: Error) => void;
    const read = new Promise((resolve, reject) => {
      next = (error) => (error ? reject(error) : resolve(undefined));
    });

    const readable = new Readable({
      read() {
        reader.next().then(
          (chunk) => {
            if (chunk.done) {
              const context = `Parsing multipart stream.`;
              const problem = `Stream unexpectedly ended.`;
              const solution = `Please try again with proper stream.`;
              const error = new Error(`${context} ${problem} ${solution}`);
              this.destroy(error);
              return next(error);
            }
            buffer = Buffer.concat([buffer, chunk.value]);

            const starterIndex = buffer.indexOf(starter);
            if (starterIndex >= 0) {
              this.push(buffer.subarray(0, starterIndex)), this.push(null);
              buffer = buffer.subarray(starterIndex);
              return next();
            }

            const enderIndex = buffer.indexOf(ender);
            if (enderIndex >= 0) {
              this.push(buffer.subarray(0, enderIndex)), this.push(null);
              buffer = buffer.subarray(enderIndex);
              return next();
            }

            if (buffer.length <= 4096) return this.push(Buffer.from([]));

            const overflowIndex = buffer.length - 4096;
            this.push(buffer.subarray(0, overflowIndex));
            buffer = buffer.subarray(overflowIndex);
          },
          (error) => {
            this.destroy(error);
            return next(error);
          },
        );
      },
    });

    readable.push(buffer);
    buffer = Buffer.from([]);
    yield readable;
    await read;
  }
}
