import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
  RegistryTag,
} from "./registry.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ContainerContract {
  readonly booted: boolean;

  readonly providerMap: Map<ProviderName, Provider>;

  readonly registry: RegistryContract;

  readonly scope: ScopeContract;

  bind(key: RegistryKey): RegistryBindTo;

  boot(): Promise<void>;

  fork(): this;

  install(name: ProviderName, provider: Provider): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[];

  resolver(key: RegistryKey): ResolverContract | undefined;

  shutdown(): Promise<void>;

  uninstall(name: ProviderName): this;
}

export type Provider = {
  boot?(container: ContainerContract): Promise<void>;

  install?(container: ContainerContract): void;

  shutdown?(container: ContainerContract): Promise<void>;

  uninstall?(container: ContainerContract): void;
};

export type ProviderName = string | symbol;
