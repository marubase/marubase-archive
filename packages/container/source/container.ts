import {
  ContainerInterface,
  Provider,
  ProviderName,
} from "./contracts/container.contract.js";
import {
  RegistryBinding,
  RegistryInterface,
  Resolvable,
  ResolvableTarget,
} from "./contracts/registry.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerInterface {
  protected _booted = false;

  protected _providerMap: Map<ProviderName, Provider> = new Map();

  protected _registry: RegistryInterface;

  protected _scope: ScopeInterface;

  public constructor(registry?: RegistryInterface, scope?: ScopeInterface) {
    this._registry = registry || new Registry();
    this._scope = scope || new Scope();
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get providerMap(): Map<ProviderName, Provider> {
    return this._providerMap;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get scope(): ScopeInterface {
    return this._scope;
  }

  public bind(binding: ResolvableTarget): RegistryBinding {
    return this._registry.bind(binding);
  }

  public async boot(): Promise<void> {
    if (this._booted) return;

    const boots: Promise<void>[] = [];
    for (const [, provider] of this._providerMap)
      if (provider.boot) boots.push(provider.boot(this));
    await Promise.all(boots);
    this._booted = true;
  }

  public bound(binding: ResolvableTarget): boolean {
    return this._registry.bound(binding);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this._registry, this._scope.fork("container")) as this;
  }

  public install(name: ProviderName, provider: Provider): this {
    if (this._providerMap.has(name)) {
      const nameText = typeof name !== "string" ? name.toString() : name;

      const context = `Installing container provider: '${nameText}'.`;
      const problem = `Provider already exists.`;
      const solution = `Please install on another name.`;
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

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    const scope = this._scope.fork("request");
    return this._registry.resolve(resolvable, scope, ...args);
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return;

    const shutdowns: Promise<void>[] = [];
    for (const [, provider] of this._providerMap)
      if (provider.shutdown) shutdowns.push(provider.shutdown(this));
    await Promise.all(shutdowns);
    this._booted = false;
  }

  public unbind(binding: ResolvableTarget): this {
    this._registry.unbind(binding);
    return this;
  }

  public uninstall(name: ProviderName): this {
    const provider = this._providerMap.get(name);
    if (typeof provider === "undefined") {
      const nameText = typeof name !== "string" ? name.toString() : name;

      const context = `Uninstalling container provider: '${nameText}'.`;
      const problem = `Provider does not exists.`;
      const solution = `Please uninstall existing provider.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (this._booted && provider.shutdown)
      provider.shutdown(this).then(() => {
        if (provider.uninstall) provider.uninstall(this);
      });
    else if (provider.uninstall) provider.uninstall(this);
    this._providerMap.delete(name);
    return this;
  }
}
