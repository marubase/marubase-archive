import { Readable } from "stream";
import { RawMessage } from "../functions/to-message-readable.js";
import { RawRequest } from "../functions/to-request-readable.js";
import { RawResponse } from "../functions/to-response-readable.js";
import { ContextContract } from "./context.contract.js";
import { MessageInterface } from "./message.contract.js";
import { MultipartInterface } from "./multipart.contract.js";
import { RequestInterface } from "./request.contract.js";
import { ResponseInterface } from "./response.contract.js";

export interface RouterInterface {
  dispatch(request: RequestInterface): Promise<ResponseInterface>;
  dispatch(
    context: ContextContract,
    nextFn: NextFn,
  ): Promise<ResponseInterface>;

  handle(handler: RouterHandler): this;
}

export type NextFn = () => Promise<ResponseInterface>;

export type RouteHandler = (
  context: ContextContract,
  nextFn: NextFn,
) => Promise<ResponseInterface>;

export type RouterHandler = RouterInterface | RouteHandler;

export type RouterFactory = {
  createMessage: (
    factory: RouterFactory,
    rawMessage?: RawMessage,
  ) => MessageInterface;

  createMultipart: (
    factory: RouterFactory,
    readable: Readable,
  ) => MultipartInterface;

  createRequest: (
    factory: RouterFactory,
    rawRequest?: RawRequest,
  ) => RequestInterface;

  createResponse: (
    factory: RouterFactory,
    rawResponse?: RawResponse,
  ) => ResponseInterface;
};
