import { Injection } from "./injection.contract.js";
import {
  Bindable,
  RegistryBinding,
  RegistryInterface,
  RegistryTag,
  RegistryTarget,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ResolverContract = Symbol("ResolverContract");

export interface ResolverInterface {
  readonly binding?: RegistryBinding;

  readonly injections: Injection[];

  readonly registry: RegistryInterface;

  readonly scope: ResolverScope;

  readonly tags: Set<RegistryTag>;

  clearBinding(): this;

  clearInjections(): this;

  clearTags(): this;

  resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result;

  setBinding(binding: Bindable): this;

  setInjections(...injections: Injection[]): this;

  setScope(scope: ResolverScope): this;

  setTags(...tags: RegistryTag[]): this;
}

export type Resolvable =
  | Omit<RegistryBinding, "environment" | "method">
  | RegistryTarget;

export type ResolverConstructor<Instance> = new (
  ...args: unknown[]
) => Instance;

export type ResolverFactory = {
  createAliasResolver(
    registry: RegistryInterface,
    alias: Resolvable,
  ): ResolverInterface;

  createBindingResolver(
    registry: RegistryInterface,
    binding: RegistryBinding,
  ): ResolverInterface;

  createClassResolver(
    registry: RegistryInterface,
    target: Function,
  ): ResolverInterface;

  createConstantResolver(
    registry: RegistryInterface,
    constant: unknown,
  ): ResolverInterface;

  createFunctionResolver(
    registry: RegistryInterface,
    target: Function,
  ): ResolverInterface;

  createMethodResolver(
    registry: RegistryInterface,
    target: Function | Object,
    method: string | symbol,
  ): ResolverInterface;

  createTagResolver(
    registry: RegistryInterface,
    tag: RegistryTag,
  ): ResolverInterface;
};

export type ResolverFunction<Instance> = (...args: unknown[]) => Instance;

export type ResolverInstance<Instance> = {
  [method: string | symbol]: (...args: unknown[]) => Instance;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
