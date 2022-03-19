import { RegistryContract, RegistryKey } from "./registry.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ResolverContract {
  readonly dependencies: RegistryKey[];

  readonly registry: RegistryContract;

  readonly registryKey?: RegistryKey;

  readonly scope: ResolverScope;

  clearDependencies(): this;

  clearRegistryKey(): this;

  resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result;

  setDependencies(...dependencies: RegistryKey[]): this;

  setRegistryKey(registryKey: RegistryKey): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverFactory = {
  createConstantResolver(
    registry: RegistryContract,
    constant: unknown,
  ): ResolverContract;

  createConstructorResolver(
    registry: RegistryContract,
    constructor: Function,
  ): ResolverContract;

  createRegistryKeyResolver(
    registry: RegistryContract,
    targetKey: RegistryKey,
  ): ResolverContract;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
