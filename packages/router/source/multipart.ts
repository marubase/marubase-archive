import {
  ContainerContract,
  ContainerInterface,
  inject,
  injectable,
} from "@marubase/container";
import { Readable } from "stream";
import {
  MessageContract,
  MessageInterface,
} from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { RouterError } from "./errors/router.error.js";
import { isReadable } from "./functions/is-readable.js";
import { toBufferReadable } from "./functions/to-buffer-readable.js";
import { toMessage } from "./functions/to-message.js";
import { toMultipartReadable } from "./functions/to-multipart-readable.js";
import { toMultipart } from "./functions/to-multipart.js";

@injectable()
export class Multipart implements MultipartInterface {
  protected _boundary =
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);

  protected _container: ContainerInterface;

  protected _content?:
    | { messages: MessageInterface[] }
    | { readable: Readable };

  protected _mimeType = "multipart/mixed";

  public constructor(@inject(ContainerContract) container: ContainerInterface) {
    this._container = container;
  }

  public get boundary(): string {
    return this._boundary;
  }

  public get container(): ContainerInterface {
    return this._container;
  }

  public get content(): Readable {
    if (typeof this._content === "undefined") {
      return toBufferReadable(Buffer.from([]));
    }

    if ("readable" in this._content) {
      const { readable } = this._content;
      return readable;
    }

    const { messages } = this._content;
    const boundary = this._boundary;
    const parts = messages.map((message) => message.toStream());
    return toMultipartReadable({ boundary, epilogue: "", parts, preamble: "" });
  }

  public get contentType(): string {
    return `${this._mimeType}; boundary="${this._boundary}"`;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public [Symbol.asyncIterator](): AsyncIterator<MessageInterface> {
    if (typeof this._content === "undefined") {
      return {
        async next(): Promise<IteratorResult<MessageInterface>> {
          return { done: true, value: undefined };
        },
      };
    }

    if ("readable" in this._content) {
      const { readable } = this._content;
      const boundary = this._boundary;
      const container = this._container;
      const iterator = toMultipart(boundary, readable);
      return {
        async next(): Promise<IteratorResult<MessageInterface>> {
          const cursor = await iterator.next();
          if (cursor.done) return { done: true, value: undefined };

          const { body, headers } = await toMessage(cursor.value);
          const message = container
            .resolve<MessageInterface>(MessageContract)
            .setBody(body)
            .setHeaders(headers);
          return { done: false, value: message };
        },
      };
    }

    const { messages } = this._content;
    const iterator = messages.values();
    return {
      async next(): Promise<IteratorResult<MessageInterface>> {
        return iterator.next();
      },
    };
  }

  public setBoundary(boundary: string): this {
    this._boundary = boundary;
    return this;
  }

  public setContent(readable: Readable): this;
  public setContent(...messages: MessageInterface[]): this;
  public setContent(
    readableOrMessage: MessageInterface | Readable,
    ...messages: MessageInterface[]
  ): this {
    this._content = !isReadable(readableOrMessage)
      ? { messages: [readableOrMessage].concat(...messages) }
      : { readable: readableOrMessage };
    return this;
  }

  public setContentType(contentType: string): this {
    const pattern = /^(multipart\/[0-9A-Za-z]+);\s*boundary="?([^"]+)"?$/;
    const matches = contentType.match(pattern);
    if (!matches) {
      const context = `Setting multipart content type.`;
      const problem = `Invalid content type format.`;
      const solution = `Please try again with a valid format.`;
      throw new RouterError(`${context} ${problem} ${solution}`);
    }
    const [, mimeType, boundary] = matches;
    this._boundary = boundary;
    this._mimeType = mimeType;
    return this;
  }

  public setMimeType(mimeType: string): this {
    if (!mimeType.match(/^multipart\/[0-9A-Za-z]+$/)) {
      const context = `Setting multipart mimetype.`;
      const problem = `Invalid mimetype format.`;
      const solution = `Please try again with a valid format.`;
      throw new RouterError(`${context} ${problem} ${solution}`);
    }
    this._mimeType = mimeType;
    return this;
  }
}
