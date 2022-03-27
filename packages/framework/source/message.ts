import { Readable } from "stream";
import {
  MessageAttachment,
  MessageBuffer,
  MessageContract,
  MessageData,
  MessageProtocol,
} from "./contracts/message.contract.js";
import { MultipartContract } from "./contracts/multipart.contract.js";
import { FrameworkError } from "./errors/framework.error.js";
import { isMultipart } from "./functions/is-multipart.js";
import { isReadable } from "./functions/is-readable.js";
import { toBufferReadable } from "./functions/to-buffer-readable.js";
import { toBuffer } from "./functions/to-buffer.js";
import { toMessageReadable } from "./functions/to-message-readable.js";
import { toMessage } from "./functions/to-message.js";
import { Multipart } from "./multipart.js";

export class Message implements MessageContract {
  public static async from(readable: Readable): Promise<Message> {
    const rawMessage = await toMessage(readable);
    return new Message()
      .setHeaders(rawMessage.headers)
      .setBody(rawMessage.body);
  }

  protected _body?:
    | { buffer: Buffer }
    | { data: MessageData }
    | { multipart: MultipartContract }
    | { stream: Readable };

  protected _headerMap = new Map<string, string>();

  protected _protocol: MessageProtocol = "HTTP/1.1";

  public get body(): Readable {
    if (typeof this._body === "undefined") {
      const buffer = Buffer.from([]);
      return toBufferReadable(buffer);
    }
    if ("buffer" in this._body) {
      const { buffer } = this._body;
      return toBufferReadable(buffer);
    }
    if ("multipart" in this._body) {
      const { multipart } = this._body;
      return multipart.toStream();
    }
    if ("stream" in this._body) {
      const { stream } = this._body;
      return stream;
    }

    const contentType =
      this._headerMap.get("Content-Type") || "application/octet-stream";
    if (contentType !== "application/json") {
      const { data } = this._body.data as MessageAttachment;
      const buffer = Buffer.from(data, "base64");
      return toBufferReadable(buffer);
    } else {
      const { data } = this._body;
      const json = JSON.stringify(data);
      const buffer = Buffer.from(json, "utf8");
      return toBufferReadable(buffer);
    }
  }

  public get headers(): Map<string, string> {
    return this._headerMap;
  }

  public get protocol(): MessageProtocol {
    return this._protocol;
  }

  public clearBody(): this {
    delete this._body;
    return this;
  }

  public clearHeader(key: string): this {
    this._headerMap.delete(key);
    return this;
  }

  public clearHeaders(): this {
    this._headerMap.clear();
    return this;
  }

  public setBody(buffer: MessageBuffer): this;
  public setBody(data: MessageData): this;
  public setBody(multipart: MultipartContract): this;
  public setBody(stream: Readable): this;
  public setBody(text: string): this;
  public setBody(
    body: MessageBuffer | MessageData | MultipartContract | Readable | string,
  ): this {
    if (ArrayBuffer.isView(body)) {
      if (!this._headerMap.has("Content-Type"))
        this._headerMap.set("Content-Type", "application/octet-stream");
      const { buffer, byteLength, byteOffset } = body;
      this._body = { buffer: Buffer.from(buffer, byteOffset, byteLength) };
      return this;
    }
    if (body instanceof ArrayBuffer) {
      if (!this._headerMap.has("Content-Type"))
        this._headerMap.set("Content-Type", "application/octet-stream");
      this._body = { buffer: Buffer.from(body) };
      return this;
    }
    if (typeof body === "string") {
      if (!this._headerMap.has("Content-Type"))
        this._headerMap.set("Content-Type", "application/octet-stream");
      this._body = { buffer: Buffer.from(body, "utf8") };
      return this;
    }
    if (isMultipart(body)) {
      if (!this._headerMap.has("Content-Type"))
        this._headerMap.set("Content-Type", body.contentType);
      this._body = { multipart: body };
      return this;
    }
    if (isReadable(body)) {
      if (!this._headerMap.has("Content-Type"))
        this._headerMap.set("Content-Type", "application/octet-stream");
      this._body = { stream: body };
      return this;
    }
    if (!this._headerMap.has("Content-Type"))
      this._headerMap.set("Content-Type", "application/json");
    this._body = { data: body };
    return this;
  }

  public setHeader(key: string, value: string): this {
    this._headerMap.set(key, value);
    return this;
  }

  public setHeaders(headers: Map<string, string>): this;
  public setHeaders(headers: [string, string][]): this;
  public setHeaders(headers: Map<string, string> | [string, string][]): this {
    this._headerMap = new Map(headers);
    return this;
  }

  public setProtocol(protocol: MessageProtocol): this {
    this._protocol = protocol;
    return this;
  }

  public async toBuffer(): Promise<Buffer> {
    if (typeof this._body === "undefined") {
      const buffer = Buffer.from([]);
      return buffer;
    }
    if ("buffer" in this._body) {
      const { buffer } = this._body;
      return buffer;
    }
    if ("multipart" in this._body) {
      const { multipart } = this._body;
      const stream = multipart.toStream();
      return toBuffer(stream);
    }
    if ("stream" in this._body) {
      const { stream } = this._body;
      return toBuffer(stream);
    }

    const contentType =
      this._headerMap.get("Content-Type") || "application/octet-stream";
    if (contentType !== "application/json") {
      const { data } = this._body.data as MessageAttachment;
      return Buffer.from(data, "base64");
    } else {
      const { data } = this._body;
      const json = JSON.stringify(data);
      return Buffer.from(json, "utf8");
    }
  }

  public async toData(): Promise<MessageData> {
    if (typeof this._body === "undefined") {
      const data: MessageData = null;
      return data;
    }
    if ("buffer" in this._body) {
      const { buffer } = this._body;
      const contentType =
        this._headerMap.get("Content-Type") || "application/octet-stream";
      if (contentType !== "application/json") {
        const data = buffer.toString("base64");
        return { data, content_type: contentType, length: buffer.length };
      } else {
        const json = buffer.toString("utf8");
        return JSON.parse(json);
      }
    }
    if ("multipart" in this._body) {
      const context = `Converting to json data.`;
      const problem = `Failed to convert message body.`;
      const solution = `Unable to convert multipart to json.`;
      throw new FrameworkError(`${context} ${problem} ${solution}`);
    }
    if ("stream" in this._body) {
      const { stream } = this._body;
      const buffer = await toBuffer(stream);
      const contentType =
        this._headerMap.get("Content-Type") || "application/octet-stream";
      if (contentType !== "application/json") {
        const data = buffer.toString("base64");
        return { data, content_type: contentType, length: buffer.length };
      } else {
        const json = buffer.toString("utf8");
        return JSON.parse(json);
      }
    }
    return this._body.data;
  }

  public toMultipart(): MultipartContract {
    if (typeof this._body === "undefined") {
      const context = `Converting to multipart.`;
      const problem = `Failed to convert message body.`;
      const solution = `Unable to convert undefined to multipart.`;
      throw new FrameworkError(`${context} ${problem} ${solution}`);
    }
    if ("buffer" in this._body) {
      const contentType =
        this._headerMap.get("Content-Type") || "application/octet-stream";
      if (!contentType.startsWith("multipart/")) {
        const context = `Converting to multipart.`;
        const problem = `Failed to convert message body.`;
        const solution = `Unable to convert buffer to multipart.`;
        throw new FrameworkError(`${context} ${problem} ${solution}`);
      } else {
        const { buffer } = this._body;
        const stream = toBufferReadable(buffer);
        return new Multipart(stream).setContentType(contentType);
      }
    }
    if ("multipart" in this._body) {
      return this._body.multipart;
    }
    if ("stream" in this._body) {
      const contentType =
        this._headerMap.get("Content-Type") || "application/octet-stream";
      if (!contentType.startsWith("multipart/")) {
        const context = `Converting to multipart.`;
        const problem = `Failed to convert message body.`;
        const solution = `Unable to convert stream to multipart.`;
        throw new FrameworkError(`${context} ${problem} ${solution}`);
      } else {
        const { stream } = this._body;
        return new Multipart(stream).setContentType(contentType);
      }
    }
    const context = `Converting to multipart.`;
    const problem = `Failed to convert message body.`;
    const solution = `Unable to convert json to multipart.`;
    throw new FrameworkError(`${context} ${problem} ${solution}`);
  }

  public toStream(): Readable {
    return toMessageReadable({
      body: this.body,
      headers: this.headers,
    });
  }

  public async toText(): Promise<string> {
    const buffer = await this.toBuffer();
    return buffer.toString("utf8");
  }
}
