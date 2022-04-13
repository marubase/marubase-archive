import { ContainerInterface } from "@marubase/container";
import { MessageProtocol } from "./message.contract.js";
import { RequestInterface, RequestMethod } from "./request.contract.js";
import { ResponseCode, ResponseInterface } from "./response.contract.js";

export const ContextContract = Symbol("ContextContract");

export interface ContextInterface extends Map<string | symbol, unknown> {
  readonly container: ContainerInterface;

  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly href: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly protocol: MessageProtocol;

  readonly queries: Record<string, string>;

  readonly request: RequestInterface;

  readonly scheme: string;

  readonly url: URL;

  respondWith(statusCode: ResponseCode, statusText?: string): ResponseInterface;
}
