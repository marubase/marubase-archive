import {
  RegistryBinding,
  RegistryInterface,
  Resolvable,
  ResolvableTag,
  ResolvableTarget,
} from "./contracts/registry.contract.js";
import {
  ResolverFactory,
  ResolverInterface,
} from "./contracts/resolver.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { BindingResolver } from "./resolvers/binding-resolver.js";
import { CallableResolver } from "./resolvers/callable-resolver.js";
import { ClassResolver } from "./resolvers/class-resolver.js";
import { ConstantResolver } from "./resolvers/constant-resolver.js";
import { FunctionResolver } from "./resolvers/function-resolver.js";
import { TagResolver } from "./resolvers/tag-resolver.js";

export class Registry implements RegistryInterface {
  protected _bindingMap: Map<ResolvableTarget, ResolverInterface> = new Map();

  protected _factory: ResolverFactory;

  protected _tagMap: Map<ResolvableTag, Set<ResolverInterface>> = new Map();

  public constructor(factory = DefaultResolverFactory) {
    this._factory = factory;
  }

  public get bindingMap(): Map<ResolvableTarget, ResolverInterface> {
    return this._bindingMap;
  }

  public get factory(): ResolverFactory {
    return this._factory;
  }

  public get tagMap(): Map<ResolvableTag, Set<ResolverInterface>> {
    return this._tagMap;
  }

  public bind(binding: ResolvableTarget): RegistryBinding {
    return {
      to: (target) =>
        this._factory.createClassResolver(this, target).setBinding(binding),

      toAlias: (alias) =>
        this._factory.createBindingResolver(this, alias).setBinding(binding),

      toCallable: (callable) =>
        this._factory
          .createCallableResolver(this, callable)
          .setBinding(binding),

      toConstant: (constant) =>
        this._factory
          .createConstantResolver(this, constant)
          .setBinding(binding),

      toFunction: (target) =>
        this._factory.createFunctionResolver(this, target).setBinding(binding),

      toTag: (tag) =>
        this._factory.createTagResolver(this, tag).setBinding(binding),
    };
  }

  public bound(binding: ResolvableTarget): boolean {
    return this._bindingMap.has(binding);
  }

  public clearResolverByBinding(binding: ResolvableTarget): this {
    this._bindingMap.delete(binding);
    return this;
  }

  public clearResolverByTags(
    tagSet: Set<ResolvableTag>,
    resolver: ResolverInterface,
  ): this {
    for (const tag of tagSet) {
      const resolverSet = this._tagMap.get(tag);
      if (typeof resolverSet === "undefined") continue;
      if (resolverSet.has(resolver)) resolverSet.delete(resolver);
      if (resolverSet.size < 1) this._tagMap.delete(tag);
    }
    return this;
  }

  public getResolverByBinding(
    binding: ResolvableTarget,
  ): ResolverInterface | undefined {
    return this._bindingMap.get(binding) || undefined;
  }

  public getResolverByTag(tag: ResolvableTag): ResolverInterface[] {
    const resolverSet = this._tagMap.get(tag);
    return typeof resolverSet !== "undefined" ? Array.from(resolverSet) : [];
  }

  public resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result {
    if (typeof resolvable === "string") {
      const pattern = /^([a-z0-9]+)#([a-z0-9]+)$/i;
      const match = resolvable.match(pattern);
      if (match) resolvable = [match[1], match[2]];
    }
    return !Array.isArray(resolvable)
      ? this._factory
          .createBindingResolver(this, resolvable)
          .resolve(scope, ...args)
      : this._factory
          .createCallableResolver(this, resolvable)
          .resolve(scope, ...args);
  }

  public setResolverByBinding(
    binding: ResolvableTarget,
    resolver: ResolverInterface,
  ): this {
    this._bindingMap.set(binding, resolver);
    return this;
  }

  public setResolverByTags(
    tagSet: Set<ResolvableTag>,
    resolver: ResolverInterface,
  ): this {
    for (const tag of tagSet) {
      if (!this._tagMap.has(tag)) this._tagMap.set(tag, new Set());
      this._tagMap.get(tag)!.add(resolver);
    }
    return this;
  }

  public unbind(binding: ResolvableTarget): this {
    this._bindingMap.get(binding)?.clearBinding();
    return this;
  }
}

export const DefaultResolverFactory: ResolverFactory = {
  createBindingResolver: (registry, target) =>
    new BindingResolver(registry, target),

  createCallableResolver: (registry, callable) =>
    new CallableResolver(registry, callable),

  createClassResolver: (registry, target) =>
    new ClassResolver(registry, target),

  createConstantResolver: (registry, constant) =>
    new ConstantResolver(registry, constant),

  createFunctionResolver: (registry, target) =>
    new FunctionResolver(registry, target),

  createTagResolver: (registry, tag) => new TagResolver(registry, tag),
};
