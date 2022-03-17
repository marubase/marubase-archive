import { CacheInterface } from "./contracts/cache.contract.js";
import { ResolvableTarget } from "./contracts/registry.contract.js";

export class Cache
  extends Map<ResolvableTarget, unknown>
  implements CacheInterface
{
  public fork(): this {
    const Static = this.constructor as typeof Cache;
    return new Static(this) as this;
  }
}
