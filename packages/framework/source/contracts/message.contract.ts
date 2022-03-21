import { Readable } from "stream";
import { MultipartContract } from "./multipart.contract.js";

export interface MessageContract {
  readonly body: Readable;

  readonly headers: Record<string, string>;

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

  toBuffer(): Promise<Buffer>;

  toData(): Promise<MessageData>;

  toMultipart(): AsyncIterable<MessageContract>;
}

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray;

export type MessageData =
  | { [property: string]: MessageData }
  | MessageData[]
  | boolean
  | number
  | string
  | undefined;
