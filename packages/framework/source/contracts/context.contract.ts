import {
  ContainerContract,
  RegistryTag,
  Resolvable,
} from "@marubase/container";
import { RequestContract, RequestMethod } from "./request.contract.js";
import { ResponseCode, ResponseContract } from "./response.contract.js";

export interface ContextContract {
  readonly container: ContainerContract;

  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly href: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly request: RequestContract;

  readonly scheme: string;

  readonly url: URL;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  respondWith(code: ResponseCode, text?: string): ResponseContract;
}
