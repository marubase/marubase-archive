import {
  RegistryInterface,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  Callable,
  ResolvableInstance,
  ResolverInterface,
} from "../contracts/resolver.contract.js";
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
  protected _callable: Callable;

  public constructor(registry: RegistryInterface, callable: Callable) {
    super(registry);
    this._callable = callable;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const [targetKey, targetMethod] = this._callable;
    const target = this._registry.resolve(targetKey, scope);
    const targetInstance = target as ResolvableInstance<Result>;
    if (isInjectable(targetInstance, targetMethod)) {
      const dependencies = getDependencies(targetInstance, targetMethod);
      this.setDependencies(...dependencies);

      const scope = getScope(targetInstance, targetMethod);
      this.setScope(scope);

      const tags = getTags(targetInstance, targetMethod);
      this.setRegistryTags(...tags);
    }

    const targetArgs = this._resolveDependencies(scope).concat(...args);
    return targetInstance[targetMethod](...targetArgs);
  }

  protected _resolveDependencies(scope: ScopeInterface): unknown[] {
    const toInstance = (dependency: RegistryKey): unknown =>
      this._registry.resolve(dependency, scope);
    return this._dependencies.map(toInstance);
  }
}
