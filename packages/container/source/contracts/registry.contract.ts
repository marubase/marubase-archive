import { ResolverFactory, ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const EnvDefault = Symbol("EnvDefault");

export const MethodAlias = Symbol("MethodAlias");

export const MethodConstructor = Symbol("MethodConstructor");

export const RegistryContract = Symbol("RegistryContract");

export const BindingAlias: Partial<RegistryBinding> = {
  environment: EnvDefault,
  method: MethodAlias,
};

export const BindingDefault: Partial<RegistryBinding> = {
  environment: EnvDefault,
  method: MethodConstructor,
};

export interface RegistryInterface {
  readonly bindings: RegistryEnvMap;

  readonly factory: ResolverFactory;

  readonly tags: RegistryTagMap;

  bind(bindable: Bindable): BindTo;

  bound(bindable: Bindable): boolean;

  clearResolverByBinding(binding: RegistryBinding): this;

  clearResolverByTags(
    tags: Set<RegistryTag>,
    resolver: ResolverInterface,
  ): this;

  getResolverByBinding(binding: RegistryBinding): ResolverInterface | undefined;

  getResolverByTag(tag: RegistryTag): ResolverInterface[];

  resolve<Result>(
    scope: ScopeInterface,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result;

  resolveClass<Result>(
    scope: ScopeInterface,
    target: Function,
    ...args: unknown[]
  ): Result;

  resolveFunction<Result>(
    scope: ScopeInterface,
    target: Function,
    ...args: unknown[]
  ): Result;

  resolveMethod<Result>(
    scope: ScopeInterface,
    target: Function | Object,
    method: string | symbol,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(
    scope: ScopeInterface,
    tag: RegistryTag,
    ...args: unknown[]
  ): Result;

  setResolverByBinding(
    binding: RegistryBinding,
    resolver: ResolverInterface,
  ): this;

  setResolverByTags(tags: Set<RegistryTag>, resolver: ResolverInterface): this;

  unbind(bindable: Bindable): this;
}

export type BindTo = {
  to(target: Function): ResolverInterface;

  toAlias(alias: Resolvable): ResolverInterface;

  toConstant(constant: unknown): ResolverInterface;

  toFunction(target: Function): ResolverInterface;

  toMethod(
    target: Function | Object,
    method: string | symbol,
  ): ResolverInterface;

  toTag(tag: RegistryTag): ResolverInterface;
};

export type Bindable = Partial<RegistryBinding> | RegistryTarget;

export type RegistryBinding = {
  environment: RegistryEnv;
  method: RegistryMethod;
  target: RegistryTarget;
};

export type RegistryEnv = string | symbol;

export type RegistryEnvMap = Map<RegistryEnv, RegistryTargetMap>;

export type RegistryTag = string | symbol;

export type RegistryTagMap = Map<RegistryTag, Set<ResolverInterface>>;

export type RegistryTarget = Function | string | symbol;

export type RegistryTargetMap = Map<RegistryTarget, RegistryMethodMap>;

export type RegistryMethod = string | symbol;

export type RegistryMethodMap = Map<RegistryMethod, ResolverInterface>;

export type Resolvable = Partial<RegistryBinding> | RegistryTarget;
