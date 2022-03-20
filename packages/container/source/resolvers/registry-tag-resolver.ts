import {
  RegistryContract,
  RegistryTag,
} from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class RegistryTagResolver
  extends BaseResolver
  implements ResolverContract
{
  protected _targetTag: RegistryTag;

  public constructor(registry: RegistryContract, targetTag: RegistryTag) {
    super(registry);
    this._targetTag = targetTag;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const resolvers = this._registry.getResolverByTag(this._targetTag);

    const toResolved = (resolver: ResolverContract): unknown =>
      resolver.resolve(scope, ...args);
    return resolvers.map(toResolved) as unknown as Result;
  }
}
