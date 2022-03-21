import {
  RegistryContract,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  ResolvableClass,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { getDependencies } from "../functions/get-dependencies.js";
import { getScope } from "../functions/get-scope.js";
import { getTags } from "../functions/get-tags.js";
import { isInjectable } from "../functions/is-injectable.js";
import { BaseResolver } from "./base-resolver.js";

export class ClassResolver extends BaseResolver implements ResolverContract {
  protected _targetClass: Function;

  public constructor(registry: RegistryContract, targetClass: Function) {
    super(registry);
    this._targetClass = targetClass;

    if (isInjectable(this._targetClass)) {
      const dependencies = getDependencies(this._targetClass);
      this.setDependencies(...dependencies);

      const scope = getScope(this._targetClass);
      this.setScope(scope);

      const tags = getTags(this._targetClass);
      this.setRegistryTags(...tags);
    }
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const targetClass = this._targetClass as ResolvableClass<Result>;
    const targetArgs = this._resolveDependencies(scope).concat(...args);
    return new targetClass(...targetArgs);
  }

  protected _resolveDependencies(scope: ScopeContract): unknown[] {
    const toInstance = (dependency: RegistryKey): unknown =>
      this._registry.resolve(dependency, scope);
    return this._dependencies.map(toInstance);
  }
}
