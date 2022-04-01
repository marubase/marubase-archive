import { Readable } from "stream";
import { MultipartInterface } from "./multipart.contract.js";

export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: Readable;

  readonly headers: Record<string, string>;

  readonly manager: MessageInterface;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(body: MessageBody): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: MessageHeaders): this;

  toBuffer(): Promise<Buffer>;

  toJson(): Promise<MessageJson>;

  toMultipart(): MultipartInterface;

  toReadable(): Readable;

  toText(): Promise<string>;
}

export type MessageBody =
  | MessageBuffer
  | MessageJson
  | MultipartInterface
  | Readable
  | string;

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray;

export type MessageHeaders = Record<string, string> | [string, string][];

export type MessageJson =
  | { [property: string]: MessageJson }
  | MessageJson[]
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
