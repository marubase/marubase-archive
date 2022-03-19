import { ResolverFactory, ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const RegistryContract = Symbol("RegistryContract");

export interface RegistryInterface {
  readonly factory: ResolverFactory;

  readonly keyMap: Map<RegistryKey, ResolverInterface>;

  bind(key: RegistryKey): RegistryBindTo;

  clearResolverByKey(key: RegistryKey): this;

  getResolverByKey(key: RegistryKey): ResolverInterface | undefined;

  resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;

  setResolverByKey(key: RegistryKey, resolver: ResolverInterface): this;
}

export type RegistryBindTo = {
  to: (constructor: Function) => ResolverInterface;

  toAlias: (alias: RegistryKey) => ResolverInterface;

  toConstant: (constant: unknown) => ResolverInterface;

  toSelf: () => ResolverInterface;
};

export type RegistryKey = Function | string | symbol;

export type Resolvable = RegistryKey;
