import {
  RegistryBindTo,
  RegistryInterface,
  RegistryKey,
  RegistryTag,
} from "./contracts/registry.contract.js";
import {
  Resolvable,
  ResolverFactory,
  ResolverInterface,
} from "./contracts/resolver.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { CallableResolver } from "./resolvers/callable-resolver.js";
import { ClassResolver } from "./resolvers/class-resolver.js";
import { ConstantResolver } from "./resolvers/constant-resolver.js";
import { FunctionResolver } from "./resolvers/function-resolver.js";
import { RegistryKeyResolver } from "./resolvers/registry-key-resolver.js";
import { RegistryTagResolver } from "./resolvers/registry-tag-resolver.js";

export class Registry implements RegistryInterface {
  protected _factory: ResolverFactory;

  protected _keyMap: Map<RegistryKey, ResolverInterface>;

  protected _tagMap: Map<RegistryTag, Set<ResolverInterface>>;

  public constructor(
    keyMap: Map<RegistryKey, ResolverInterface> = new Map(),
    tagMap: Map<RegistryTag, Set<ResolverInterface>> = new Map(),
    factory = DefaultResolverFactory,
  ) {
    this._keyMap = keyMap;
    this._tagMap = tagMap;
    this._factory = factory;
  }

  public get factory(): ResolverFactory {
    return this._factory;
  }

  public get keyMap(): Map<RegistryKey, ResolverInterface> {
    return this._keyMap;
  }

  public get tagMap(): Map<RegistryTag, Set<ResolverInterface>> {
    return this._tagMap;
  }

  public bind(key: RegistryKey): RegistryBindTo {
    return {
      to: (targetClass) =>
        this._factory
          .createClassResolver(this, targetClass)
          .setRegistryKey(key),

      toAlias: (targetKey) =>
        this._factory
          .createRegistryKeyResolver(this, targetKey)
          .setRegistryKey(key),

      toCallable: (callable) =>
        this._factory
          .createCallableResolver(this, callable)
          .setRegistryKey(key),

      toConstant: (constant) =>
        this._factory
          .createConstantResolver(this, constant)
          .setRegistryKey(key),

      toFunction: (targetFn) =>
        this._factory
          .createFunctionResolver(this, targetFn)
          .setRegistryKey(key),

      toSelf: () => {
        if (typeof key !== "function") {
          const context = `Binding to key to self.`;
          const problem = `Key is not a class.`;
          const solution = `Please make sure key is a class before binding to itself.`;
          throw new ContainerError(`${context} ${problem} ${solution}`);
        }
        return this._factory.createClassResolver(this, key).setRegistryKey(key);
      },

      toTag: (targetTag) =>
        this._factory
          .createRegistryTagResolver(this, targetTag)
          .setRegistryKey(key),
    };
  }

  public call<Result>(
    targetFn: Function,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result {
    return this._factory
      .createFunctionResolver(this, targetFn)
      .resolve(scope, ...args);
  }

  public clearResolverByKey(key: RegistryKey): this {
    this._keyMap.delete(key);
    return this;
  }

  public clearResolverByTags(
    tagSet: Set<RegistryTag>,
    resolver: ResolverInterface,
  ): this {
    for (const tag of tagSet) {
      const resolverSet = this._tagMap.get(tag);
      if (typeof resolverSet === "undefined") continue;

      resolverSet.delete(resolver);
      if (resolverSet.size < 1) this._tagMap.delete(tag);
    }
    return this;
  }

  public create<Result>(
    targetClass: Function,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result {
    return this._factory
      .createClassResolver(this, targetClass)
      .resolve(scope, ...args);
  }

  public fork(): this {
    const Static = this.constructor as typeof Registry;
    const forkKeyMap = new Map(this._keyMap);
    const forkTagMap = new Map();
    for (const [tag, tagSet] of this._tagMap)
      forkTagMap.set(tag, new Set(tagSet));
    return new Static(forkKeyMap, forkTagMap, this._factory) as this;
  }

  public getResolverByKey(key: RegistryKey): ResolverInterface | undefined {
    return this._keyMap.get(key);
  }

  public getResolverByTag(tag: RegistryTag): ResolverInterface[] {
    const resolverSet = this._tagMap.get(tag);
    return typeof resolverSet !== "undefined" ? Array.from(resolverSet) : [];
  }

  public resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result {
    if (typeof resolvable === "string") {
      const callable = /^([0-9A-Za-z]+)#([0-9A-Za-z]+)$/i;
      const match = resolvable.match(callable);
      if (match) resolvable = [match[1], match[2]];
    }
    return Array.isArray(resolvable)
      ? this._factory
          .createCallableResolver(this, resolvable)
          .resolve(scope, ...args)
      : this._factory
          .createRegistryKeyResolver(this, resolvable)
          .resolve(scope, ...args);
  }

  public resolveTag<Result>(
    tag: RegistryTag,
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result[] {
    return this._factory
      .createRegistryTagResolver(this, tag)
      .resolve(scope, ...args);
  }

  public setResolverByKey(key: RegistryKey, resolver: ResolverInterface): this {
    this._keyMap.set(key, resolver);
    return this;
  }

  public setResolverByTags(
    tagSet: Set<RegistryTag>,
    resolver: ResolverInterface,
  ): this {
    for (const tag of tagSet) {
      if (!this._tagMap.has(tag)) this._tagMap.set(tag, new Set());

      const resolverSet = this._tagMap.get(tag) as Set<ResolverInterface>;
      resolverSet.add(resolver);
    }
    return this;
  }
}

export const DefaultResolverFactory: ResolverFactory = {
  createCallableResolver: (registry, callable) =>
    new CallableResolver(registry, callable),

  createClassResolver: (registry, targetClass) =>
    new ClassResolver(registry, targetClass),

  createConstantResolver: (registry, constant) =>
    new ConstantResolver(registry, constant),

  createFunctionResolver: (registry, targetFn) =>
    new FunctionResolver(registry, targetFn),

  createRegistryKeyResolver: (registry, targetKey) =>
    new RegistryKeyResolver(registry, targetKey),

  createRegistryTagResolver: (registry, targetTag) =>
    new RegistryTagResolver(registry, targetTag),
};
