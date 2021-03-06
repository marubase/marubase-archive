import {
  RegistryInterface,
  RegistryKey,
  RegistryTag,
} from "../contracts/registry.contract.js";
import {
  ResolverInterface,
  ResolverScope,
} from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";

export class BaseResolver implements ResolverInterface {
  protected _dependencies: RegistryKey[] = [];

  protected _registry: RegistryInterface;

  protected _registryKey?: RegistryKey;

  protected _registryTagSet = new Set<RegistryTag>();

  protected _scope: ResolverScope = "transient";

  public constructor(registry: RegistryInterface) {
    this._registry = registry;
  }

  public get dependencies(): RegistryKey[] {
    return this._dependencies;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get registryKey(): RegistryKey | undefined {
    return this._registryKey;
  }

  public get registryTags(): RegistryTag[] {
    return Array.from(this._registryTagSet);
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

  public clearRegistryTags(): this {
    if (this._registryTagSet.size < 1) return this;
    this._registry.clearResolverByTags(this._registryTagSet, this);
    this._registryTagSet.clear();
    return this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
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

  public setRegistryTags(...tags: RegistryTag[]): this {
    if (this._registryTagSet.size > 0) this.clearRegistryTags();
    this._registryTagSet = new Set(tags);
    this._registry.setResolverByTags(this._registryTagSet, this);
    return this;
  }

  public setScope(scope: ResolverScope): this {
    this._scope = scope;
    return this;
  }
}
