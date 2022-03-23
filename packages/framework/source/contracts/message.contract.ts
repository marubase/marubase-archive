import { Readable } from "stream";
import { MultipartContract } from "./multipart.contract.js";

export interface MessageContract {
  readonly body: Readable;

  readonly headers: Record<string, string>;

  readonly protocol: MessageProtocol;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(buffer: MessageBuffer): this;
  setBody(data: MessageData): this;
  setBody(multipart: MultipartContract): this;
  setBody(stream: Readable): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Map<string, string>): this;
  setHeaders(headers: [string, string][]): this;

  setProtocol(protocol: MessageProtocol): this;

  toBuffer(): Promise<Buffer>;

  toData(): Promise<MessageData>;

  toMultipart(): AsyncIterable<MessageContract>;

  toStream(): Readable;
}

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray;

export type MessageData =
  | { [property: string]: MessageData }
  | MessageData[]
  | boolean
  | number
  | string
  | undefined;

export type MessageProtocol = "HTTP/1.0" | "HTTP/1.1" | "HTTP/2" | "HTTP/3";
