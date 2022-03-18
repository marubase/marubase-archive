import { ResolverFactory, ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const RegistryContract = Symbol("RegistryContract");

export interface RegistryInterface {
  readonly bindingMap: Map<ResolvableTarget, ResolverInterface>;

  readonly factory: ResolverFactory;

  readonly tagMap: Map<ResolvableTag, Set<ResolverInterface>>;

  bind(binding: ResolvableTarget): RegistryBinding;

  bound(binding: ResolvableTarget): boolean;

  clearResolverByBinding(binding: ResolvableTarget): this;

  clearResolverByTags(
    tagSet: Set<ResolvableTag>,
    resolver: ResolverInterface,
  ): this;

  getResolverByBinding(
    binding: ResolvableTarget,
  ): ResolverInterface | undefined;

  getResolverByTag(tag: ResolvableTag): ResolverInterface[];

  resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(
    tag: ResolvableTag,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result[];

  setResolverByBinding(
    binding: ResolvableTarget,
    resolver: ResolverInterface,
  ): this;

  setResolverByTags(
    tagSet: Set<ResolvableTag>,
    resolver: ResolverInterface,
  ): this;

  unbind(binding: ResolvableTarget): this;
}

export type RegistryBinding = {
  to: (target: Function) => ResolverInterface;

  toAlias: (alias: ResolvableTarget) => ResolverInterface;

  toCallable: (callable: ResolvableCallable) => ResolverInterface;

  toConstant: (constant: unknown) => ResolverInterface;

  toFunction: (target: Function) => ResolverInterface;

  toSelf: () => ResolverInterface;

  toTag: (tag: ResolvableTag) => ResolverInterface;
};

export type Resolvable = ResolvableCallable | ResolvableTarget;

export type ResolvableCallable = [ResolvableTarget, ResolvableMethod];

export type ResolvableConstructor<Result> = new (...args: unknown[]) => Result;

export type ResolvableFunction<Result> = (...args: unknown[]) => Result;

export type ResolvableInstance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};

export type ResolvableMethod = string | symbol;

export type ResolvableTag = string | symbol;

export type ResolvableTarget = Function | string | symbol;
