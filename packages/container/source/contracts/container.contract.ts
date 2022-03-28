import {
  RegistryBindTo,
  RegistryInterface,
  RegistryKey,
  RegistryTag,
} from "./registry.contract.js";
import { Resolvable, ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ContainerContract = Symbol("ContainerContract");

export interface ContainerInterface {
  readonly booted: boolean;

  readonly providerMap: Map<ProviderName, Provider>;

  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(key: RegistryKey): RegistryBindTo;

  boot(): Promise<void>;

  call<Result>(targetFn: Function, ...args: unknown[]): Result;

  create<Result>(targetClass: Function, ...args: unknown[]): Result;

  fork(): this;

  install(name: ProviderName, provider: Provider): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  resolver(key: RegistryKey): ResolverInterface | undefined;

  shutdown(): Promise<void>;

  uninstall(name: ProviderName): this;
}

export type Provider = {
  boot?(container: ContainerInterface): Promise<void>;

  install?(container: ContainerInterface): void;

  shutdown?(container: ContainerInterface): Promise<void>;

  uninstall?(container: ContainerInterface): void;
};

export type ProviderName = string | symbol;
