import {
  RegistryBindTo,
  RegistryContract,
  RegistryKey,
} from "./contracts/registry.contract.js";
import {
  Resolvable,
  ResolverContract,
  ResolverFactory,
} from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { CallableResolver } from "./resolvers/callable-resolver.js";
import { ClassResolver } from "./resolvers/class-resolver.js";
import { ConstantResolver } from "./resolvers/constant-resolver.js";
import { RegistryKeyResolver } from "./resolvers/registry-key-resolver.js";

export class Registry implements RegistryContract {
  protected _keyMap = new Map<RegistryKey, ResolverContract>();

  protected _resolverFactory: ResolverFactory;

  public constructor(resolverFactory = DefaultResolverFactory) {
    this._resolverFactory = resolverFactory;
  }

  public get keyMap(): Map<RegistryKey, ResolverContract> {
    return this._keyMap;
  }

  public get resolverFactory(): ResolverFactory {
    return this._resolverFactory;
  }

  public bind(key: RegistryKey): RegistryBindTo {
    return {
      to: (constructor: Function) =>
        this._resolverFactory
          .createClassResolver(this, constructor)
          .setRegistryKey(key),

      toAlias: (alias) =>
        this._resolverFactory
          .createRegistryKeyResolver(this, alias)
          .setRegistryKey(key),

      toCallable: (callable) =>
        this._resolverFactory
          .createCallableResolver(this, callable)
          .setRegistryKey(key),

      toConstant: (constant) =>
        this._resolverFactory
          .createConstantResolver(this, constant)
          .setRegistryKey(key),

      toSelf: () => {
        if (typeof key !== "function") {
          const context = `Binding to key to self.`;
          const problem = `Key is not a class.`;
          const solution = `Please make sure key is a class before binding to itself.`;
          throw new ContainerError(`${context} ${problem} ${solution}`);
        }
        return this._resolverFactory
          .createClassResolver(this, key)
          .setRegistryKey(key);
      },
    };
  }

  public clearResolverByKey(key: RegistryKey): this {
    this._keyMap.delete(key);
    return this;
  }

  public getResolverByKey(key: RegistryKey): ResolverContract | undefined {
    return this._keyMap.get(key);
  }

  public resolve<Result>(
    resolvable: Resolvable,
    scope: ScopeContract,
    ...args: unknown[]
  ): Result {
    if (typeof resolvable === "string") {
      const callable = /^([0-9A-Za-z]+)#([0-9A-Za-z]+)$/i;
      const match = resolvable.match(callable);
      if (match) resolvable = [match[1], match[2]];
    }
    return Array.isArray(resolvable)
      ? this._resolverFactory
          .createCallableResolver(this, resolvable)
          .resolve(scope, ...args)
      : this._resolverFactory
          .createRegistryKeyResolver(this, resolvable)
          .resolve(scope, ...args);
  }

  public setResolverByKey(key: RegistryKey, resolver: ResolverContract): this {
    this._keyMap.set(key, resolver);
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

  createRegistryKeyResolver: (registry, targetKey) =>
    new RegistryKeyResolver(registry, targetKey),
};
