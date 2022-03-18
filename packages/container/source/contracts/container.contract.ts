import {
  RegistryBinding,
  RegistryInterface,
  Resolvable,
  ResolvableTag,
  ResolvableTarget,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ContainerContract = Symbol("ContainerContract");

export interface ContainerInterface {
  readonly booted: boolean;

  readonly providerMap: Map<ProviderName, Provider>;

  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(binding: ResolvableTarget): RegistryBinding;

  boot(): Promise<void>;

  bound(binding: ResolvableTarget): boolean;

  fork(): this;

  install(name: ProviderName, provider: Provider): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: ResolvableTag, ...args: unknown[]): Result[];

  shutdown(): Promise<void>;

  unbind(binding: ResolvableTarget): this;

  uninstall(name: ProviderName): this;
}

export type ProviderName = string | symbol;

export type Provider = {
  boot?(container: ContainerInterface): Promise<void>;

  install?(container: ContainerInterface): void;

  shutdown?(container: ContainerInterface): Promise<void>;

  uninstall?(container: ContainerInterface): void;
};
