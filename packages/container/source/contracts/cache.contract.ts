import { RegistryKey } from "./registry.contract.js";

export interface CacheContract extends Map<RegistryKey, unknown> {
  fork(): this;
}
