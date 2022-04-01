import { Readable } from "stream";
import { ManagerInterface } from "./manager.contract.js";
import {
  MessageBody,
  MessageHeaders,
  MessageInterface,
} from "./message.contract.js";

export const MultipartContract = Symbol("MultipartContract");

export interface MultipartInterface extends AsyncIterable<MessageInterface> {
  readonly boundary: string;

  readonly contentType: string;

  readonly manager: ManagerInterface;

  readonly mimeType: string;

  addPart(body: MessageBody, headers?: MessageHeaders): MessageInterface;

  getPart(index: number): MessageInterface | undefined;

  removePart(index: number): MessageInterface | undefined;

  setBoundary(boundary: string): this;

  setContentType(contentType: string): this;

  setMimeType(mimeType: string): this;

  toReadable(): Readable;
}
