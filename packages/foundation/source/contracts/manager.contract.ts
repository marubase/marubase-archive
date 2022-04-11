import { RegistryTag, Resolvable } from "@marubase/container";
import { RouterInterface } from "./router.contract.js";
import { ServiceInterface } from "./service.contract.js";

export const ManagerContract = Symbol("ManagerContract");

export interface ManagerInterface extends RouterInterface {
  call<Result>(targetFn: Function, ...args: unknown[]): Result;

  create<Result>(targetClass: Function, ...args: unknown[]): Result;

  factory<Result>(resolvable: Resolvable): (...args: unknown[]) => Result;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  service(href: string, base?: string): ServiceInterface;
  service(url: URL): ServiceInterface;
}
