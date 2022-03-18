import {
  RegistryInterface,
  ResolvableCallable,
  ResolvableInstance,
  ResolvableMethod,
  ResolvableTarget,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { getDependencies } from "../functions/get-dependencies.js";
import { getScope } from "../functions/get-scope.js";
import { getTags } from "../functions/get-tags.js";
import { isInjectable } from "../functions/is-injectable.js";
import { BaseResolver } from "./base-resolver.js";

export class CallableResolver
  extends BaseResolver
  implements ResolverInterface
{
  protected _method: ResolvableMethod;

  protected _target: ResolvableTarget;

  public constructor(
    registry: RegistryInterface,
    callable: ResolvableCallable,
  ) {
    super(registry);

    const [target, method] = callable;
    this._target = target;
    this._method = method;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const result = this._registry.resolve(this._target, scope);
    const target = result as ResolvableInstance<Result>;
    const method = this._method;

    if (isInjectable(target, method)) {
      const resolverDependencies = getDependencies(target, method);
      this.setDependencies(...resolverDependencies);

      const resolverScope = getScope(target);
      this.setScope(resolverScope);

      const resolverTags = getTags(target);
      this.setTags(...resolverTags);
    }

    const methodArgs = this.resolveDependencies(scope).concat(...args);
    return target[method](...methodArgs);
  }
}
