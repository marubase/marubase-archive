import {
  RegistryContract,
  RegistryKey,
  RegistryTag,
} from "./registry.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ResolverContract {
  readonly dependencies: RegistryKey[];

  readonly registry: RegistryContract;

  readonly registryKey?: RegistryKey;

  readonly registryTags: RegistryTag[];

  readonly scope: ResolverScope;

  clearDependencies(): this;

  clearRegistryKey(): this;

  clearRegistryTags(): this;

  resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result;

  setDependencies(...dependencies: RegistryKey[]): this;

  setRegistryKey(registryKey: RegistryKey): this;

  setRegistryTags(...tags: RegistryTag[]): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverFactory = {
  createCallableResolver(
    registry: RegistryContract,
    callable: Callable,
  ): ResolverContract;

  createClassResolver(
    registry: RegistryContract,
    targetClass: Function,
  ): ResolverContract;

  createConstantResolver(
    registry: RegistryContract,
    constant: unknown,
  ): ResolverContract;

  createFunctionResolver(
    registry: RegistryContract,
    targetFn: Function,
  ): ResolverContract;

  createRegistryKeyResolver(
    registry: RegistryContract,
    targetKey: RegistryKey,
  ): ResolverContract;

  createRegistryTagResolver(
    registry: RegistryContract,
    targetTag: RegistryTag,
  ): ResolverContract;
};

export type Callable = [RegistryKey, string | symbol];

export type Resolvable = Callable | RegistryKey;

export type ResolvableClass<Instance> = new (...args: unknown[]) => Instance;

export type ResolvableFunction<Result> = (...args: unknown[]) => Result;

export type ResolvableInstance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
