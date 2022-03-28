import {
  RegistryInterface,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  ResolvableClass,
  ResolverInterface,
} from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { getDependencies } from "../functions/get-dependencies.js";
import { getScope } from "../functions/get-scope.js";
import { getTags } from "../functions/get-tags.js";
import { isInjectable } from "../functions/is-injectable.js";
import { BaseResolver } from "./base-resolver.js";

export class ClassResolver extends BaseResolver implements ResolverInterface {
  protected _targetClass: Function;

  public constructor(registry: RegistryInterface, targetClass: Function) {
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

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const targetClass = this._targetClass as ResolvableClass<Result>;
    const targetArgs = this._resolveDependencies(scope).concat(...args);
    return new targetClass(...targetArgs);
  }

  protected _resolveDependencies(scope: ScopeInterface): unknown[] {
    const toInstance = (dependency: RegistryKey): unknown =>
      this._registry.resolve(dependency, scope);
    return this._dependencies.map(toInstance);
  }
}
