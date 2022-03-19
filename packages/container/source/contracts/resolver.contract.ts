import { RegistryInterface, RegistryKey } from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ResolverContract = Symbol("ResolverContract");

export interface ResolverInterface {
  readonly dependencies: RegistryKey[];

  readonly registry: RegistryInterface;

  readonly registryKey?: RegistryKey;

  readonly scope: ResolverScope;

  clearDependencies(): this;

  clearRegistryKey(): this;

  resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result;

  setDependencies(...dependencies: RegistryKey[]): this;

  setRegistryKey(registryKey: RegistryKey): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverFactory = {
  createConstantResolver: (
    registry: RegistryInterface,
    constant: unknown,
  ) => ResolverInterface;

  createConstructorResolver: (
    registry: RegistryInterface,
    constructor: Function,
  ) => ResolverInterface;

  createRegistryKeyResolver: (
    registry: RegistryInterface,
    targetKey: RegistryKey,
  ) => ResolverInterface;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
