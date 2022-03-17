import { ContainerInterface } from "./contracts/container.contract.js";
import {
  RegistryBinding,
  RegistryInterface,
  Resolvable,
  ResolvableTarget,
} from "./contracts/registry.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerInterface {
  protected _registry: RegistryInterface;

  protected _scope: ScopeInterface;

  public constructor(registry?: RegistryInterface, scope?: ScopeInterface) {
    this._registry = registry || new Registry();
    this._scope = scope || new Scope();
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

  public bound(binding: ResolvableTarget): boolean {
    return this._registry.bound(binding);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this._registry, this._scope.fork("container")) as this;
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    const scope = this._scope.fork("request");
    return this._registry.resolve(resolvable, scope, ...args);
  }

  public unbind(binding: ResolvableTarget): this {
    this._registry.unbind(binding);
    return this;
  }
}
