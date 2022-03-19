import { CacheContract } from "./contracts/cache.contract.js";
import { RegistryKey } from "./contracts/registry.contract.js";

export class Cache extends Map<RegistryKey, unknown> implements CacheContract {
  public fork(): this {
    const Static = this.constructor as typeof Cache;
    return new Static(this) as this;
  }
}
