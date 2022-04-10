import { Readable } from "stream";
import { MultipartInterface } from "./multipart.contract.js";

export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: Readable;

  readonly headers: Map<string, string>;

  readonly protocol: MessageProtocol;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(buffer: MessageBuffer): this;
  setBody(data: MessageData): this;
  setBody(multipart: MultipartInterface): this;
  setBody(readable: Readable): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Map<string, string>): this;
  setHeaders(headers: [string, string][]): this;

  setProtocol(protocol: MessageProtocol): this;

  toBuffer(): Promise<Buffer>;

  toData(): Promise<MessageData>;

  toMultipart(): MultipartInterface;

  toStream(): Readable;

  toText(): Promise<string>;
}

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray | string;

export type MessageData =
  | { [key: string]: MessageData }
  | MessageData[]
  | boolean
  | null
  | number
  | string;

export type MessageProtocol =
  | "HTTP/0.9"
  | "HTTP/1.0"
  | "HTTP/1.1"
  | "HTTP/2"
  | "HTTP/3";
