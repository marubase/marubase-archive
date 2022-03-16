import {
  ProviderInterface,
  ProviderMap,
  ProviderName,
} from "./provider.contract.js";
import {
  Bindable,
  BindTo,
  RegistryInterface,
  RegistryTag,
  Resolvable,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ContainerContract = Symbol("ContainerContract");

export interface ContainerInterface {
  readonly booted: boolean;

  readonly providers: ProviderMap;

  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(bindable: Bindable): BindTo;

  boot(): Promise<void>;

  bound(binding: Bindable): boolean;

  install(name: ProviderName, provider: ProviderInterface): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveClass<Result>(target: Function, ...args: unknown[]): Result;

  resolveFunction<Result>(target: Function, ...args: unknown[]): Result;

  resolveMethod<Result>(
    target: Function | Object,
    method: string | symbol,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  shutdown(): Promise<void>;

  unbind(binding: Bindable): this;

  uninstall(): Promise<void>;
}
