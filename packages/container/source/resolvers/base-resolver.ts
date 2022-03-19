import {
  RegistryContract,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  ResolverContract,
  ResolverScope,
} from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";

export class BaseResolver implements ResolverContract {
  protected _dependencies: RegistryKey[] = [];

  protected _registry: RegistryContract;

  protected _registryKey?: RegistryKey;

  protected _scope: ResolverScope = "transient";

  public constructor(registry: RegistryContract) {
    this._registry = registry;
  }

  public get dependencies(): RegistryKey[] {
    return this._dependencies;
  }

  public get registry(): RegistryContract {
    return this._registry;
  }

  public get registryKey(): RegistryKey | undefined {
    return this._registryKey;
  }

  public get scope(): ResolverScope {
    return this._scope;
  }

  public clearDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public clearRegistryKey(): this {
    if (typeof this._registryKey === "undefined") return this;
    this._registry.clearResolverByKey(this._registryKey);
    delete this._registryKey;
    return this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const context = `Resolving base resolver.`;
    const problem = `Resolve method not implemented.`;
    const solution = `Please extend the base resolver and override the resolve method.`;
    throw new ContainerError(`${context} ${problem} ${solution}`);
  }

  public setDependencies(...dependencies: RegistryKey[]): this {
    this._dependencies = dependencies;
    return this;
  }

  public setRegistryKey(registryKey: RegistryKey): this {
    if (typeof this._registryKey !== "undefined") this.clearRegistryKey();
    this._registryKey = registryKey;
    this._registry.setResolverByKey(this._registryKey, this);
    return this;
  }

  public setScope(scope: ResolverScope): this {
    this._scope = scope;
    return this;
  }
}
