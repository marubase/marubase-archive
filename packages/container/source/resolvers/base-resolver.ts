import {
  RegistryInterface,
  ResolvableTag,
  ResolvableTarget,
} from "../contracts/registry.contract.js";
import {
  ResolverInterface,
  ResolverScope,
} from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";

export class BaseResolver implements ResolverInterface {
  protected _binding?: ResolvableTarget;

  protected _dependencies: ResolvableTarget[] = [];

  protected _registry: RegistryInterface;

  protected _scope: ResolverScope = "transient";

  protected _tagSet: Set<ResolvableTag> = new Set();

  public constructor(registry: RegistryInterface) {
    this._registry = registry;
  }

  public get binding(): ResolvableTarget | undefined {
    return this._binding;
  }

  public get dependencies(): ResolvableTarget[] {
    return this._dependencies;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get scope(): ResolverScope {
    return this._scope;
  }

  public get tags(): ResolvableTag[] {
    return Array.from(this._tagSet);
  }

  public clearBinding(): this {
    if (typeof this._binding === "undefined") return this;
    this._registry.clearResolverByBinding(this._binding);
    delete this._binding;
    return this;
  }

  public clearDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public clearTags(): this {
    if (this._tagSet.size < 1) return this;
    this._registry.clearResolverByTags(this._tagSet, this);
    this._tagSet.clear();
    return this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const context = `Resolving base resolver.`;
    const problem = `Resolve method not implemented.`;
    const solution = `Please extend the base resolver and override the resolve method.`;
    throw new ContainerError(`${context} ${problem} ${solution}`);
  }

  public setBinding(binding: ResolvableTarget): this {
    if (typeof this._binding !== "undefined") this.clearBinding();
    this._binding = binding;
    this._registry.setResolverByBinding(this._binding, this);
    return this;
  }

  public setDependencies(...dependencies: ResolvableTarget[]): this {
    this._dependencies = dependencies;
    return this;
  }

  public setScope(scope: ResolverScope): this {
    this._scope = scope;
    return this;
  }

  public setTags(...tags: ResolvableTag[]): this {
    if (this._tagSet.size > 0) this.clearTags();
    this._tagSet = new Set(tags);
    this._registry.setResolverByTags(this._tagSet, this);
    return this;
  }

  protected _resolveDependencies(
    scope: ScopeInterface,
    ...args: unknown[]
  ): unknown[] {
    const toInstance = (dependency: ResolvableTarget): unknown =>
      this._registry.resolve(dependency, scope, ...args);
    return this._dependencies.map(toInstance);
  }
}
