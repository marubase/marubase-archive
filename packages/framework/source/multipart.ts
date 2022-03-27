import { Readable } from "stream";
import { MessageContract } from "./contracts/message.contract.js";
import { MultipartContract } from "./contracts/multipart.contract.js";
import { FrameworkError } from "./errors/framework.error.js";
import { isReadable } from "./functions/is-readable.js";
import { toMultipartReadable } from "./functions/to-multipart-readable.js";
import { toMultipart } from "./functions/to-multipart.js";
import { Message } from "./message.js";

export class Multipart implements MultipartContract {
  protected _body: { parts: MessageContract[] } | { stream: Readable };

  protected _boundary =
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);

  protected _mimeType = "multipart/mixed";

  public constructor(
    readableOrPart: MessageContract | Readable,
    ...parts: MessageContract[]
  ) {
    this._body = !isReadable(readableOrPart)
      ? { parts: [readableOrPart, ...parts] }
      : { stream: readableOrPart };
  }

  public get boundary(): string {
    return this._boundary;
  }

  public get contentType(): string {
    return `${this.mimeType}; boundary="${this.boundary}"`;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public [Symbol.asyncIterator](): AsyncIterator<MessageContract> {
    if ("parts" in this._body) {
      const iterator = this._body.parts.values();
      return {
        next: (): Promise<IteratorResult<MessageContract>> =>
          Promise.resolve(iterator.next()),
      };
    }

    const iterator = toMultipart(this._boundary, this._body.stream);
    return {
      next: async (): Promise<IteratorResult<MessageContract>> => {
        const cursor = await iterator.next();
        if (cursor.done) return { done: true, value: undefined };

        const value = await Message.from(cursor.value);
        return { done: false, value };
      },
    };
  }

  public setBoundary(boundary: string): this {
    this._boundary = boundary;
    return this;
  }

  public setContentType(contentType: string): this {
    const pattern = /^(multipart\/.+);\s*boundary="(.+)"$/;
    const matches = contentType.match(pattern);
    if (!matches) {
      const context = `Setting multipart content type.`;
      const problem = `Content type does not match multipart content type pattern.`;
      const solution = `Please make sure content type is in the correct pattern.`;
      throw new FrameworkError(`${context} ${problem} ${solution}`);
    }

    const [, mimeType, boundary] = matches;
    this._mimeType = mimeType;
    this._boundary = boundary;
    return this;
  }

  public setMimeType(mimeType: string): this {
    if (mimeType.startsWith("multipart/")) {
      const context = `Setting multipart mime type.`;
      const problem = `Mime type does not starts with 'multipart/'.`;
      const solution = `Please make sure mime type starts with 'multipart/'.`;
      throw new FrameworkError(`${context} ${problem} ${solution}`);
    }
    this._mimeType = mimeType;
    return this;
  }

  public toStream(): Readable {
    if ("stream" in this._body) return this._body.stream;
    return toMultipartReadable({
      boundary: this._boundary,
      parts: this._body.parts.map((part) => part.toStream()),
    });
  }
}
