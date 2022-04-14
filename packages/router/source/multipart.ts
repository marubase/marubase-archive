import {
  ContainerContract,
  ContainerInterface,
  inject,
  injectable,
} from "@marubase/container";
import { Readable } from "stream";
import { MessageInterface } from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { isReadable } from "./functions/is-readable.js";
import { toBufferReadable } from "./functions/to-buffer-readable.js";

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
    // update to support both readable and messages
    return toBufferReadable(Buffer.from([]));
  }

  public get contentType(): string {
    return `${this._mimeType}; boundary="${this._boundary}"`;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public [Symbol.asyncIterator](): AsyncIterator<MessageInterface> {
    // update to support both readable and messages
    return {
      async next(): Promise<IteratorResult<MessageInterface>> {
        return { done: true, value: undefined };
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
    // match content type or throw error
    return this;
  }

  public setMimeType(mimeType: string): this {
    // match mime type or throw error
    this._mimeType = mimeType;
    return this;
  }
}
