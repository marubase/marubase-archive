import { Readable } from "stream";
import { MessageInterface } from "./message.contract.js";

export interface MultipartInterface extends AsyncIterable<MessageInterface> {
  readonly boundary: string;

  readonly contentType: string;

  readonly mimeType: string;

  setBoundary(boundary: string): this;

  setContentType(contentType: string): this;

  setMimeType(mimeType: string): this;

  toStream(): Readable;
}
