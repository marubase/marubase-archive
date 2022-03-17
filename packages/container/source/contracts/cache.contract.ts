import { ResolvableTarget } from "./registry.contract.js";

export const CacheContract = Symbol("CacheContract");

export interface CacheInterface extends Map<ResolvableTarget, unknown> {
  fork(): this;
}
