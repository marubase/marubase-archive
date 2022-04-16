import {
  ContainerContract,
  ContainerInterface,
  inject,
  injectable,
} from "@marubase/container";
import { Readable } from "stream";
import {
  MessageBuffer,
  MessageData,
  MessageInterface,
  MessageProtocol,
} from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { isMultipart } from "./functions/is-multipart.js";
import { isReadable } from "./functions/is-readable.js";
import { toBufferReadable } from "./functions/to-buffer-readable.js";
import { toBuffer } from "./functions/to-buffer.js";
import { toMessageReadable } from "./functions/to-message-readable.js";

@injectable()
export class Message implements MessageInterface {
  protected _body?:
    | { buffer: Buffer }
    | { data: MessageData }
    | { multipart: MultipartInterface }
    | { readable: Readable };

  protected _container: ContainerInterface;

  protected _headers = new Map<string, string>();

  protected _protocol: MessageProtocol = "HTTP/1.1";

  public constructor(@inject(ContainerContract) container: ContainerInterface) {
    this._container = container;
  }

  public get body(): Readable {
    if (typeof this._body === "undefined") {
      const readable = toBufferReadable(Buffer.from([]));
      this._body = { readable };
      return this._body.readable;
    }
    if ("buffer" in this._body) {
      const { buffer } = this._body;
      const readable = toBufferReadable(buffer);
      this._body = { readable };
      return this._body.readable;
    }
    if ("multipart" in this._body) {
      const { multipart } = this._body;
      const readable = multipart.content;
      this._body = { readable };
      return this._body.readable;
    }
    if ("readable" in this._body) {
      return this._body.readable;
    }
    const { data } = this._body;
    const json = JSON.stringify(data);
    const readable = toBufferReadable(json);
    this._body = { readable };
    return this._body.readable;
  }

  public get container(): ContainerInterface {
    return this._container;
  }

  public get headers(): Map<string, string> {
    return new Map(this._headers);
  }

  public get protocol(): MessageProtocol {
    return this._protocol;
  }

  public clearBody(): this {
    delete this._body;
    return this;
  }

  public clearHeader(key: string): this {
    this._headers.delete(key);
    return this;
  }

  public clearHeaders(): this {
    this._headers.clear();
    return this;
  }

  public setBody(buffer: MessageBuffer): this;
  public setBody(data: MessageData): this;
  public setBody(multipart: MultipartInterface): this;
  public setBody(readable: Readable): this;
  public setBody(
    body: MessageBuffer | MessageData | MultipartInterface | Readable,
  ): this {
    if (ArrayBuffer.isView(body)) {
      const { buffer, byteLength, byteOffset } = body;
      this._body = { buffer: Buffer.from(buffer, byteOffset, byteLength) };
      return this;
    }
    if (body instanceof ArrayBuffer) {
      this._body = { buffer: Buffer.from(body) };
      return this;
    }
    if (isMultipart(body)) {
      this._body = { multipart: body };
      return this;
    }
    if (isReadable(body)) {
      this._body = { readable: body };
      return this;
    }
    this._body = { data: body };
    return this;
  }

  public setHeader(key: string, value: string): this {
    this._headers.set(key, value);
    return this;
  }

  public setHeaders(headers: Map<string, string>): this;
  public setHeaders(headers: [string, string][]): this;
  public setHeaders(headers: Map<string, string> | [string, string][]): this {
    this._headers = new Map(headers);
    return this;
  }

  public setProtocol(protocol: MessageProtocol): this {
    this._protocol = protocol;
    return this;
  }

  public async toBuffer(): Promise<Buffer> {
    if (typeof this._body === "undefined") {
      const buffer = Buffer.from([]);
      this._body = { buffer };
      return this._body.buffer;
    }
    if ("buffer" in this._body) {
      return this._body.buffer;
    }
    if ("multipart" in this._body) {
      const { multipart } = this._body;
      const buffer = await toBuffer(multipart.content);
      this._body = { buffer };
      return this._body.buffer;
    }
    if ("readable" in this._body) {
      const { readable } = this._body;
      const buffer = await toBuffer(readable);
      this._body = { buffer };
      return this._body.buffer;
    }
    const { data } = this._body;
    const json = JSON.stringify(data);
    const buffer = Buffer.from(json, "utf8");
    this._body = { buffer };
    return this._body.buffer;
  }

  public async toData(): Promise<MessageData> {
    if (typeof this._body === "undefined") {
      const data = null;
      this._body = { data };
      return this._body.data;
    }
    if ("buffer" in this._body) {
      const { buffer } = this._body;
      const json = buffer.toString("utf8");
      const data = JSON.parse(json);
      this._body = { data };
      return this._body.data;
    }
    if ("multipart" in this._body) {
      const { multipart } = this._body;
      const data: MessageData[] = [];
      for await (const message of multipart) data.push(await message.toData());
      this._body = { data };
      return this._body.data;
    }
    if ("readable" in this._body) {
      const { readable } = this._body;
      const buffer = await toBuffer(readable);
      const json = buffer.toString("utf8");
      const data = JSON.parse(json);
      this._body = { data };
      return this._body.data;
    }
    return this._body.data;
  }

  public toMultipart(): MultipartInterface {
    if (typeof this._body === "undefined") {
      const multipart =
    }
  }

  public toStream(): Readable {
    const { body, headers } = this;
    return toMessageReadable({ body, headers });
  }

  public async toText(): Promise<string> {
    const buffer = await this.toBuffer();
    return buffer.toString("utf8");
  }
}
