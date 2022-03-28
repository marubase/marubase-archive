import {
  ContainerContract,
  RegistryTag,
  Resolvable,
} from "@marubase/container";
import { MessageProtocol } from "./message.contract.js";
import { RequestContract, RequestMethod } from "./request.contract.js";
import { ResponseCode, ResponseContract } from "./response.contract.js";

export interface ContextContract extends Map<unknown, unknown> {
  readonly container: ContainerContract;

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

  readonly request: RequestContract;

  readonly scheme: string;

  readonly url: URL;

  call<Result>(targetFn: Function, ...args: unknown[]): Result;

  create<Result>(targetClass: Function, ...args: unknown[]): Result;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  respondWith(statusCode: ResponseCode, statusText?: string): ResponseContract;
}
