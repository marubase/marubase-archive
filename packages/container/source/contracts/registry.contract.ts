import {
  Callable,
  Resolvable,
  ResolverContract,
  ResolverFactory,
} from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface RegistryContract {
  readonly factory: ResolverFactory;

  readonly keyMap: Map<RegistryKey, ResolverContract>;

  readonly tagMap: Map<RegistryTag, Set<ResolverContract>>;

  bind(key: RegistryKey): RegistryBindTo;

  call<Result>(
    targetFn: Function,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result;

  clearResolverByKey(key: RegistryKey): this;

  clearResolverByTags(
    tagSet: Set<RegistryTag>,
    resolver: ResolverContract,
  ): this;

  create<Result>(
    targetClass: Function,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result;

  fork(): this;

  getResolverByKey(key: RegistryKey): ResolverContract | undefined;

  getResolverByTag(tag: RegistryTag): ResolverContract[];

  resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(
    tag: RegistryTag,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result[];

  setResolverByKey(key: RegistryKey, resolver: ResolverContract): this;

  setResolverByTags(tagSet: Set<RegistryTag>, resolver: ResolverContract): this;
}

export type RegistryBindTo = {
  to(targetClass: Function): ResolverContract;

  toAlias(targetKey: RegistryKey): ResolverContract;

  toCallable(callable: Callable): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toFunction(targetFn: Function): ResolverContract;

  toSelf(): ResolverContract;

  toTag(targetTag: RegistryTag): ResolverContract;
};

export type RegistryKey = Function | string | symbol;

export type RegistryTag = string | symbol;
