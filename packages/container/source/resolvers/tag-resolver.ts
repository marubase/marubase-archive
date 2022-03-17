import {
  RegistryInterface,
  ResolvableTag,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class TagResolver extends BaseResolver implements ResolverInterface {
  protected _tag: ResolvableTag;

  public constructor(registry: RegistryInterface, tag: ResolvableTag) {
    super(registry);
    this._tag = tag;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const resolvers = this._registry.getResolverByTag(this._tag);
    return resolvers.map((resolver) =>
      resolver.resolve(scope, ...args),
    ) as unknown as Result;
  }
}
