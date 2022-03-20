import { ContainerContract } from "./contracts/container.contract.js";
import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
} from "./contracts/registry.contract.js";
import { ResolverContract } from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerContract {
  protected _registry: RegistryContract;

  protected _scope: ScopeContract;

  public constructor(registry?: RegistryContract, scope?: ScopeContract) {
    this._registry = registry || new Registry();
    this._scope = scope || new Scope();
    this.bind("Container").toConstant(this);
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

  public fork(): this {
    const Static = this.constructor as typeof Container;
    const containerScope = this._scope.fork("container");
    return new Static(this._registry, containerScope) as this;
  }

  public resolve<Result>(resolvable: RegistryKey, ...args: unknown[]): Result {
    const requestScope = this._scope.fork("request");
    return this._registry.resolve(resolvable, requestScope, ...args);
  }

  public resolver(key: RegistryKey): ResolverContract | undefined {
    return this._registry.getResolverByKey(key);
  }
}
