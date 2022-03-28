import {
  Callable,
  Resolvable,
  ResolverFactory,
  ResolverInterface,
} from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const RegistryContract = Symbol("RegistryContract");

export interface RegistryInterface {
  readonly factory: ResolverFactory;

  readonly keyMap: Map<RegistryKey, ResolverInterface>;

  readonly tagMap: Map<RegistryTag, Set<ResolverInterface>>;

  bind(key: RegistryKey): RegistryBindTo;

  call<Result>(
    targetFn: Function,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;

  clearResolverByKey(key: RegistryKey): this;

  clearResolverByTags(
    tagSet: Set<RegistryTag>,
    resolver: ResolverInterface,
  ): this;

  create<Result>(
    targetClass: Function,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;

  fork(): this;

  getResolverByKey(key: RegistryKey): ResolverInterface | undefined;

  getResolverByTag(tag: RegistryTag): ResolverInterface[];

  resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(
    tag: RegistryTag,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result[];

  setResolverByKey(key: RegistryKey, resolver: ResolverInterface): this;

  setResolverByTags(
    tagSet: Set<RegistryTag>,
    resolver: ResolverInterface,
  ): this;
}

export type RegistryBindTo = {
  to(targetClass: Function): ResolverInterface;

  toAlias(targetKey: RegistryKey): ResolverInterface;

  toCallable(callable: Callable): ResolverInterface;

  toConstant(constant: unknown): ResolverInterface;

  toFunction(targetFn: Function): ResolverInterface;

  toSelf(): ResolverInterface;

  toTag(targetTag: RegistryTag): ResolverInterface;
};

export type RegistryKey = Function | string | symbol;

export type RegistryTag = string | symbol;
