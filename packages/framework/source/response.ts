import { Readable } from "stream";
import { MessageProtocol } from "./contracts/message.contract.js";
import {
  ResponseCode,
  ResponseContract,
  ResponseText,
} from "./contracts/response.contract.js";
import { toResponseReadable } from "./functions/to-response-readable.js";
import { toResponse } from "./functions/to-response.js";
import { Message } from "./message.js";

export class Response extends Message implements ResponseContract {
  public static async from(readable: Readable): Promise<Response> {
    const rawResponse = await toResponse(readable);
    return new Response()
      .setProtocol(rawResponse.protocol as MessageProtocol)
      .setStatusCode(rawResponse.statusCode as ResponseCode)
      .setStatusText(rawResponse.statusText)
      .setHeaders(rawResponse.headers)
      .setBody(rawResponse.body);
  }

  protected _statusCode: ResponseCode = 200;

  protected _statusText: string = ResponseText[200];

  public get statusCode(): ResponseCode {
    return this._statusCode;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public setStatusCode(statusCode: ResponseCode): this {
    this._statusCode = statusCode;
    this._statusText = ResponseText[statusCode];
    return this;
  }

  public setStatusText(statusText: string): this {
    this._statusText = statusText;
    return this;
  }

  public toStream(): Readable {
    return toResponseReadable({
      body: this.body,
      headers: this.headers,
      protocol: this.protocol,
      statusCode: this.statusCode,
      statusText: this.statusText,
    });
  }
}
