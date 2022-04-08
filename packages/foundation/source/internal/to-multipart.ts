import { Readable } from "stream";
import { toBufferReadable } from "./to-buffer-readable.js";

export async function* toMultipart(
  boundary: string,
  readable: Readable,
): AsyncIterableIterator<Readable> {
  const reader = readable[Symbol.asyncIterator]() as AsyncIterator<Buffer>;

  const openDelimiter = Buffer.from(`\r\n--${boundary}\r\n`, "utf8");
  const closeDelimiter = Buffer.from(`\r\n--${boundary}--`, "utf8");

  const delimiter = Buffer.from(`--${boundary}`, "utf8");
  const openTail = Buffer.from("\r\n", "utf8");
  const closeTail = Buffer.from("--", "utf8");

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const delimiterIndex = buffer.indexOf(delimiter);

    /* istanbul ignore next */
    if (delimiterIndex < 0) continue;

    const delimiterOffset = delimiterIndex + delimiter.length;
    const delimiterTail = buffer.subarray(delimiterOffset, delimiterOffset + 2);

    /* istanbul ignore next */
    if (!delimiterTail.equals(openTail) && !delimiterTail.equals(closeTail))
      continue;

    /* istanbul ignore next */
    if (delimiterTail.equals(closeTail)) return;

    buffer = buffer.subarray(delimiterOffset + 2);
    while (true) {
      const openIndex = buffer.indexOf(openDelimiter);
      if (openIndex >= 0) {
        const readable = toBufferReadable(buffer.subarray(0, openIndex));
        buffer = buffer.subarray(openIndex + openDelimiter.length);
        yield readable;
        continue;
      }

      const closeIndex = buffer.indexOf(closeDelimiter);
      if (closeIndex >= 0) {
        const readable = toBufferReadable(buffer.subarray(0, closeIndex));
        buffer = buffer.subarray(closeIndex + closeDelimiter.length);
        yield readable;
        return;
      }

      break;
    }

    let nextPart: (error?: Error) => void;
    const part = new Promise(
      (resolve, reject) =>
        (nextPart = (error) => (error ? reject(error) : resolve(undefined))),
    );

    const readable = new Readable({
      read() {
        reader.next().then(
          (chunk) => {
            if (chunk.done) {
              const context = `Parsing multipart readable.`;
              const problem = `Stream unexpectedly ended.`;
              const solution = `Please try again.`;
              const error = new Error(`${context} ${problem} ${solution}`);
              return Promise.reject(error);
            }
            buffer = Buffer.concat([buffer, chunk.value]);

            const openIndex = buffer.indexOf(openDelimiter);
            if (openIndex >= 0) {
              this.push(buffer.subarray(0, openIndex)), this.push(null);
              buffer = buffer.subarray(openIndex);
              return nextPart();
            }

            const closeIndex = buffer.indexOf(closeDelimiter);
            if (closeIndex >= 0) {
              this.push(buffer.subarray(0, closeIndex)), this.push(null);
              buffer = buffer.subarray(closeIndex);
              return nextPart();
            }

            /* istanbul ignore next */
            if (buffer.length <= 4096) this.push(Buffer.from([]));
            else {
              const overflowIndex = buffer.length - 4096;
              this.push(buffer.subarray(0, overflowIndex));
              buffer = buffer.subarray(overflowIndex);
            }
          },
          (error) => {
            this.destroy(error);
            return nextPart(error);
          },
        );
      },
    });

    readable.push(buffer);
    buffer = Buffer.from([]);

    yield readable;
    await part;
  }
}
