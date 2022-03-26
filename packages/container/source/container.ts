import {
  ContainerContract,
  Provider,
  ProviderName,
} from "./contracts/container.contract.js";
import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
  RegistryTag,
} from "./contracts/registry.contract.js";
import { ResolverContract } from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerContract {
  protected _booted = false;

  protected _providerMap = new Map<ProviderName, Provider>();

  protected _registry: RegistryContract;

  protected _scope: ScopeContract;

  public constructor(
    registry: RegistryContract = new Registry(),
    scope: ScopeContract = new Scope(),
  ) {
    this._registry = registry;
    this._scope = scope;
    this.bind("Container").toConstant(this);
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get providerMap(): Map<ProviderName, Provider> {
    return this._providerMap;
  }

  public get registry(): RegistryContract {
    return this._registry;
  }

  public get scope(): ScopeContract {
    return this._scope;
  }

  public bind(key: RegistryKey): RegistryBindTo {
    return this._registry.bind(key);
  }

  public async boot(): Promise<void> {
    if (this._booted) return;

    const bootPromises: Promise<void>[] = [];
    for (const [, provider] of this._providerMap)
      if (provider.boot) bootPromises.push(provider.boot(this));
    await Promise.all(bootPromises);
    this._booted = true;
  }

  public call<Result>(targetFn: Function, ...args: unknown[]): Result {
    const requestScope = this._scope.fork("request");
    return this._registry.call(targetFn, requestScope, ...args);
  }

  public create<Result>(targetClass: Function, ...args: unknown[]): Result {
    const requestScope = this._scope.fork("request");
    return this._registry.create(targetClass, requestScope, ...args);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    const forkRegistry = this._registry.fork();
    const containerScope = this._scope.fork("container");
    return new Static(forkRegistry, containerScope) as this;
  }

  public install(name: ProviderName, provider: Provider): this {
    if (this._providerMap.has(name)) {
      const nameText = typeof name === "symbol" ? name.toString() : name;

      const context = `Installing provider '${nameText}'.`;
      const problem = `Provider name already exists.`;
      const solution = `Please install on another name or uninstall existing provider.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (provider.install) provider.install(this);
    if (this._booted && provider.boot) provider.boot(this);
    this._providerMap.set(name, provider);
    return this;
  }

  public installed(name: ProviderName): boolean {
    return this._providerMap.has(name);
  }

  public resolve<Result>(resolvable: RegistryKey, ...args: unknown[]): Result {
    const requestScope = this._scope.fork("request");
    return this._registry.resolve(resolvable, requestScope, ...args);
  }

  public resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[] {
    const requestScope = this._scope.fork("request");
    return this._registry.resolveTag(tag, requestScope, ...args);
  }

  public resolver(key: RegistryKey): ResolverContract | undefined {
    return this._registry.getResolverByKey(key);
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return;

    const shutdownPromises: Promise<void>[] = [];
    for (const [, provider] of this._providerMap)
      if (provider.shutdown) shutdownPromises.push(provider.shutdown(this));
    await Promise.all(shutdownPromises);
    this._booted = false;
  }

  public uninstall(name: ProviderName): this {
    if (!this._providerMap.has(name)) {
      const nameText = typeof name === "symbol" ? name.toString() : name;

      const context = `Uninstalling provider '${nameText}'.`;
      const problem = `Provider name does not exists.`;
      const solution = `Please uninstall another name or install provider on the name.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    const provider = this._providerMap.get(name);
    if (typeof provider === "undefined") return this;

    if (this._booted && provider.shutdown)
      provider.shutdown(this).then(() => {
        return provider.uninstall
          ? provider.uninstall(this)
          : Promise.resolve();
      });
    else if (provider.uninstall) provider.uninstall(this);
    return this;
  }
}
