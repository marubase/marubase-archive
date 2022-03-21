import {
  RegistryContract,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  ResolvableFunction,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { getDependencies } from "../functions/get-dependencies.js";
import { getScope } from "../functions/get-scope.js";
import { getTags } from "../functions/get-tags.js";
import { isInjectable } from "../functions/is-injectable.js";
import { BaseResolver } from "./base-resolver.js";

export class FunctionResolver extends BaseResolver implements ResolverContract {
  protected _targetFn: Function;

  public constructor(registry: RegistryContract, targetFn: Function) {
    super(registry);
    this._targetFn = targetFn;

    if (isInjectable(this._targetFn)) {
      const dependencies = getDependencies(this._targetFn);
      this.setDependencies(...dependencies);

      const scope = getScope(this._targetFn);
      this.setScope(scope);

      const tags = getTags(this._targetFn);
      this.setRegistryTags(...tags);
    }
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const targetFn = this._targetFn as ResolvableFunction<Result>;
    const targetArgs = this._resolveDependencies(scope).concat(...args);
    return targetFn(...targetArgs);
  }

  protected _resolveDependencies(scope: ScopeContract): unknown[] {
    const toInstance = (dependency: RegistryKey): unknown =>
      this._registry.resolve(dependency, scope);
    return this._dependencies.map(toInstance);
  }
}
