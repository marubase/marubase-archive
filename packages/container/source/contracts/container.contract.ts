import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
} from "./registry.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ContainerContract {
  readonly registry: RegistryContract;

  readonly scope: ScopeContract;

  bind(key: RegistryKey): RegistryBindTo;

  fork(): this;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolver(key: RegistryKey): ResolverContract | undefined;
}
