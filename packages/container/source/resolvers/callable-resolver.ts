import {
  RegistryInterface,
  ResolvableCallable,
  ResolvableInstance,
  ResolvableMethod,
  ResolvableTarget,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
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
    this._target = callable[0];
    this._method = callable[1];
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const instance = this._registry.resolve<ResolvableInstance<Result>>(
      this._target,
      scope,
    );
    if (!(this._method in instance)) {
      const targetText =
        typeof this._target !== "string"
          ? typeof this._target !== "function"
            ? this._target.toString()
            : this._target.name
          : this._target;
      const methodText =
        typeof this._method !== "string"
          ? this._method.toString()
          : this._method;
      const callableText = `${targetText}#${methodText}`;

      const context = `Resolving callable resolver: '${callableText}'.`;
      const problem = `Callable method not found.`;
      const solution = `Please invoke existing method.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    const methodArgs = this.resolveDependencies(scope).concat(...args);
    return instance[this._method](...methodArgs);
  }
}
