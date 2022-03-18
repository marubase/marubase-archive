import {
  RegistryInterface,
  ResolvableFunction,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { getDependencies } from "../functions/get-dependencies.js";
import { getScope } from "../functions/get-scope.js";
import { getTags } from "../functions/get-tags.js";
import { isInjectable } from "../functions/is-injectable.js";
import { BaseResolver } from "./base-resolver.js";

export class FunctionResolver
  extends BaseResolver
  implements ResolverInterface
{
  protected _target: Function;

  public constructor(registry: RegistryInterface, target: Function) {
    super(registry);
    this._target = target;

    if (isInjectable(this._target)) {
      const resolverDependencies = getDependencies(this._target);
      this.setDependencies(...resolverDependencies);

      const resolverScope = getScope(this._target);
      this.setScope(resolverScope);

      const resolverTags = getTags(this._target);
      this.setTags(...resolverTags);
    }
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const target = this._target as ResolvableFunction<Result>;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return target(...targetArgs);
  }
}
