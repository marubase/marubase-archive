import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class ConstantResolver
  extends BaseResolver
  implements ResolverInterface
{
  protected _constant: unknown;

  public constructor(registry: RegistryInterface, constant: unknown) {
    super(registry);
    this._constant = constant;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    return this._constant as Result;
  }
}
