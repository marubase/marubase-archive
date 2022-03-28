import {
  RegistryInterface,
  RegistryKey,
  RegistryTag,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ResolverContract = Symbol("ResolverContract");

export interface ResolverInterface {
  readonly dependencies: RegistryKey[];

  readonly registry: RegistryInterface;

  readonly registryKey?: RegistryKey;

  readonly registryTags: RegistryTag[];

  readonly scope: ResolverScope;

  clearDependencies(): this;

  clearRegistryKey(): this;

  clearRegistryTags(): this;

  resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result;

  setDependencies(...dependencies: RegistryKey[]): this;

  setRegistryKey(registryKey: RegistryKey): this;

  setRegistryTags(...tags: RegistryTag[]): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverFactory = {
  createCallableResolver(
    registry: RegistryInterface,
    callable: Callable,
  ): ResolverInterface;

  createClassResolver(
    registry: RegistryInterface,
    targetClass: Function,
  ): ResolverInterface;

  createConstantResolver(
    registry: RegistryInterface,
    constant: unknown,
  ): ResolverInterface;

  createFunctionResolver(
    registry: RegistryInterface,
    targetFn: Function,
  ): ResolverInterface;

  createRegistryKeyResolver(
    registry: RegistryInterface,
    targetKey: RegistryKey,
  ): ResolverInterface;

  createRegistryTagResolver(
    registry: RegistryInterface,
    targetTag: RegistryTag,
  ): ResolverInterface;
};

export type Callable = [RegistryKey, string | symbol];

export type Resolvable = Callable | RegistryKey;

export type ResolvableClass<Instance> = new (...args: unknown[]) => Instance;

export type ResolvableFunction<Result> = (...args: unknown[]) => Result;

export type ResolvableInstance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
