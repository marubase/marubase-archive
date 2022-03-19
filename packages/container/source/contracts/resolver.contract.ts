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
  createClassResolver(
    registry: RegistryContract,
    targetClass: Function,
  ): ResolverContract;

  createConstantResolver(
    registry: RegistryContract,
    constant: unknown,
  ): ResolverContract;

  createRegistryKeyResolver(
    registry: RegistryContract,
    targetKey: RegistryKey,
  ): ResolverContract;
};

export type ResolvableClass<Instance> = new (...args: unknown[]) => Instance;

export type ResolverScope = "container" | "request" | "singleton" | "transient";
