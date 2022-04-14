import { ContainerInterface } from "@marubase/container";
import { Readable } from "stream";
import { MessageInterface } from "./message.contract.js";

export const MultipartContract = Symbol("MultipartContract");

export interface MultipartInterface extends AsyncIterable<MessageInterface> {
  readonly boundary: string;

  readonly container: ContainerInterface;

  readonly content: Readable;

  readonly contentType: string;

  readonly mimeType: string;

  setBoundary(boundary: string): this;

  setContent(readable: Readable): this;
  setContent(...messages: MessageInterface[]): this;

  setContentType(contentType: string): this;

  setMimeType(mimeType: string): this;
}
