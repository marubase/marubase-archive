import {
  RegistryInterface,
  ResolvableCallable,
  ResolvableTag,
  ResolvableTarget,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ResolverContract = Symbol("ResolverContract");

export interface ResolverInterface {
  readonly binding?: ResolvableTarget;

  readonly dependencies: ResolvableTarget[];

  readonly registry: RegistryInterface;

  readonly scope: ResolverScope;

  readonly tags: ResolvableTag[];

  clearBinding(): this;

  clearDependencies(): this;

  clearTags(): this;

  resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result;

  setBinding(binding: ResolvableTarget): this;

  setDependencies(...dependencies: ResolvableTarget[]): this;

  setScope(scope: ResolverScope): this;

  setTags(...tags: ResolvableTag[]): this;
}

export type ResolverFactory = {
  createBindingResolver: (
    registry: RegistryInterface,
    target: ResolvableTarget,
  ) => ResolverInterface;

  createCallableResolver: (
    registry: RegistryInterface,
    callable: ResolvableCallable,
  ) => ResolverInterface;

  createClassResolver: (
    registry: RegistryInterface,
    target: Function,
  ) => ResolverInterface;

  createConstantResolver: (
    registry: RegistryInterface,
    constant: unknown,
  ) => ResolverInterface;

  createFunctionResolver: (
    registry: RegistryInterface,
    target: Function,
  ) => ResolverInterface;

  createTagResolver: (
    registry: RegistryInterface,
    tag: ResolvableTag,
  ) => ResolverInterface;
};

export type ResolverScope = "container" | "request" | "singleton" | "transient";
