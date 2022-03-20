import {
  RegistryContract,
  RegistryKey,
} from "../contracts/registry.contract.js";
import {
  Callable,
  ResolvableInstance,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class CallableResolver extends BaseResolver implements ResolverContract {
  protected _callable: Callable;

  public constructor(registry: RegistryContract, callable: Callable) {
    super(registry);
    this._callable = callable;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const [targetKey, targetMethod] = this._callable;
    const target = this._registry.resolve(targetKey, scope);
    const targetInstance = target as ResolvableInstance<Result>;
    const targetArgs = this._resolveDependencies(scope).concat(...args);
    return targetInstance[targetMethod](...targetArgs);
  }

  protected _resolveDependencies(scope: ScopeContract): unknown[] {
    const toInstance = (dependency: RegistryKey): unknown =>
      this._registry.resolve(dependency, scope);
    return this._dependencies.map(toInstance);
  }
}
