import {
  RegistryInterface,
  ResolvableTarget,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

export class BindingResolver extends BaseResolver implements ResolverInterface {
  protected _target: ResolvableTarget;

  public constructor(registry: RegistryInterface, target: ResolvableTarget) {
    super(registry);
    this._target = target;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const resolver = this._registry.getResolverByBinding(this._target);
    if (typeof resolver === "undefined") {
      const bindingText =
        typeof this._target !== "string"
          ? this._target.toString()
          : this._target;

      const context = `Resolving binding resolver: '${bindingText}'.`;
      const problem = `Binding record not found.`;
      const solution = `Please resolve bounded record.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (resolver.scope === "transient") return resolver.resolve(scope, ...args);

    const cache = scope[resolver.scope];
    return !cache.has(this._target)
      ? (cache
          .set(this._target, resolver.resolve(scope, ...args))
          .get(this._target) as Result)
      : (cache.get(this._target) as Result);
  }
}
