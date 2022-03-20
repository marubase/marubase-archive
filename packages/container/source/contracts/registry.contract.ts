import {
  Resolvable,
  ResolverContract,
  ResolverFactory,
} from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface RegistryContract {
  readonly keyMap: Map<RegistryKey, ResolverContract>;

  readonly resolverFactory: ResolverFactory;

  bind(key: RegistryKey): RegistryBindTo;

  clearResolverByKey(key: RegistryKey): this;

  getResolverByKey(key: RegistryKey): ResolverContract | undefined;

  resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result;

  setResolverByKey(key: RegistryKey, resolver: ResolverContract): this;
}

export type RegistryBindTo = {
  to(constructor: Function): ResolverContract;

  toAlias(alias: RegistryKey): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toSelf(): ResolverContract;
};

export type RegistryKey = Function | string | symbol;
