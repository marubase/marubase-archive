import { RegistryKey } from "./registry.contract.js";

export const CacheContract = Symbol("CacheContract");

export interface CacheInterface extends Map<RegistryKey, unknown> {
  fork(): this;
}
