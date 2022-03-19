import {
  RegistryContract,
  RegistryKey,
} from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

export class RegistryKeyResolver
  extends BaseResolver
  implements ResolverContract
{
  protected _targetKey: RegistryKey;

  public constructor(registry: RegistryContract, targetKey: RegistryKey) {
    super(registry);
    this._targetKey = targetKey;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const resolver = this._registry.getResolverByKey(this._targetKey);
    if (typeof resolver === "undefined") {
      const context = `Resolving registry key resolver.`;
      const problem = `Target key not found.`;
      const solution = `Please try another target key or bind to the target key before resolving.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }
    if (resolver.scope === "transient") return resolver.resolve(scope, ...args);

    const cache = scope[resolver.scope];
    return !cache.has(this._targetKey)
      ? (cache
          .set(this._targetKey, resolver.resolve(scope, ...args))
          .get(this._targetKey) as Result)
      : (cache.get(this._targetKey) as Result);
  }
}
