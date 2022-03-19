import {
  RegistryBindTo,
  RegistryInterface,
  RegistryKey,
  Resolvable,
} from "./registry.contract.js";
import { ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ContainerContract = Symbol("ContainerContract");

export interface CotainerInterface {
  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(key: RegistryKey): RegistryBindTo;

  getResolverByKey(key: RegistryKey): ResolverInterface | undefined;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;
}
