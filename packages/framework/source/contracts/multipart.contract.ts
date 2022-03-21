import { Readable } from "stream";
import { MessageContract } from "./message.contract.js";

export interface MultipartContract extends AsyncIterable<MessageContract> {
  readonly boundary: string;

  readonly contentType: string;

  readonly mimeType: string;

  setBoundary(boundary: string): this;

  setContentType(contentType: string): this;

  setMimeType(mimeType: string): this;

  toStream(): Readable;
}
