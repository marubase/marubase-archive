import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
  RegistryResolvable,
} from "./registry.contract.js";
import { ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ContainerContract {
  readonly registry: RegistryContract;

  readonly scope: ScopeContract;

  bind(key: RegistryKey): RegistryBindTo;

  getResolverByKey(key: RegistryKey): ResolverContract | undefined;

  resolve<Result>(resolvable: RegistryResolvable, ...args: unknown[]): Result;
}
