import { RegistryTag, Resolvable } from "@marubase/container";
import { Readable } from "stream";
import { ManagerInterface } from "./manager.contract.js";
import {
  MessageBuffer,
  MessageData,
  MessageInterface,
  MessageProtocol,
} from "./message.contract.js";
import { MultipartInterface } from "./multipart.contract.js";
import { RequestInterface, RequestMethod } from "./request.contract.js";
import { ResponseCode, ResponseInterface } from "./response.contract.js";
import { ServiceInterface } from "./service.contract.js";

export const ContextContract = Symbol("ContextContract");

export interface ContextInterface extends Map<string | symbol, unknown> {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly href: string;

  readonly manager: ManagerInterface;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly protocol: MessageProtocol;

  readonly queries: Record<string, string>;

  readonly request: RequestInterface;

  readonly scheme: string;

  readonly url: URL;

  call<Result>(targetFn: Function, ...args: unknown[]): Result;

  create<Result>(targetClass: Function, ...args: unknown[]): Result;

  factory<Result>(resolvable: Resolvable): (...args: unknown[]) => Result;

  message(buffer: MessageBuffer): MessageInterface;
  message(data: MessageData): MessageInterface;
  message(multipart: MultipartInterface): MessageInterface;
  message(readable: Readable): MessageInterface;

  multipart(...messages: MessageInterface[]): MultipartInterface;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  respondWith(statusCode: ResponseCode, statusText?: string): ResponseInterface;

  service(href: string, base?: string): ServiceInterface;
  service(url: URL): ServiceInterface;
}
