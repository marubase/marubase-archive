import {
  ContainerContract,
  ContainerInterface,
  ContainerProvider,
  ContainerProviderName,
} from "./contracts/container.contract.js";
import {
  RegistryBindTo,
  RegistryInterface,
  RegistryKey,
  RegistryTag,
} from "./contracts/registry.contract.js";
import {
  Resolvable,
  ResolverInterface,
} from "./contracts/resolver.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerInterface {
  protected _booted = false;

  protected _providerMap = new Map<ContainerProviderName, ContainerProvider>();

  protected _registry: RegistryInterface;

  protected _scope: ScopeInterface;

  public constructor(
    registry: RegistryInterface = new Registry(),
    scope: ScopeInterface = new Scope(),
  ) {
    this._registry = registry;
    this._scope = scope;
    this.bind(ContainerContract).toConstant(this);
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get providerMap(): Map<ContainerProviderName, ContainerProvider> {
    return this._providerMap;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get scope(): ScopeInterface {
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

  public factory<Result>(
    resolvable: Resolvable,
  ): (...args: unknown[]) => Result {
    return (...args) => this.resolve(resolvable, ...args);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    const forkRegistry = this._registry.fork();
    const containerScope = this._scope.fork("container");
    return new Static(forkRegistry, containerScope) as this;
  }

  public install(
    name: ContainerProviderName,
    provider: ContainerProvider,
  ): this {
    if (this._providerMap.has(name)) {
      const nameText = typeof name === "symbol" ? name.toString() : name;

      const context = `Installing provider '${nameText}'.`;
      const problem = `ContainerProvider name already exists.`;
      const solution = `Please install on another name or uninstall existing provider.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (provider.install) provider.install(this);
    if (this._booted && provider.boot) provider.boot(this);
    this._providerMap.set(name, provider);
    return this;
  }

  public installed(name: ContainerProviderName): boolean {
    return this._providerMap.has(name);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    const requestScope = this._scope.fork("request");
    return this._registry.resolve(resolvable, requestScope, ...args);
  }

  public resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[] {
    const requestScope = this._scope.fork("request");
    return this._registry.resolveTag(tag, requestScope, ...args);
  }

  public resolver(key: RegistryKey): ResolverInterface | undefined {
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

  public uninstall(name: ContainerProviderName): this {
    const provider = this._providerMap.get(name);
    if (typeof provider === "undefined") {
      const nameText = typeof name === "symbol" ? name.toString() : name;

      const context = `Uninstalling provider '${nameText}'.`;
      const problem = `ContainerProvider name does not exists.`;
      const solution = `Please uninstall another name or install provider on the name.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

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
