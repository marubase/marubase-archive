import {
  RegistryInterface,
  RegistryTag,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class RegistryTagResolver
  extends BaseResolver
  implements ResolverInterface
{
  protected _targetTag: RegistryTag;

  public constructor(registry: RegistryInterface, targetTag: RegistryTag) {
    super(registry);
    this._targetTag = targetTag;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const resolvers = this._registry.getResolverByTag(this._targetTag);

    const toResolved = (resolver: ResolverInterface): unknown =>
      resolver.resolve(scope, ...args);
    return resolvers.map(toResolved) as unknown as Result;
  }
}
