import { CacheInterface } from "./cache.contract.js";

export const ScopeContract = Symbol("ScopeContract");

export interface ScopeInterface {
  readonly container: CacheInterface;

  readonly request: CacheInterface;

  readonly singleton: CacheInterface;

  fork(type: ForkType): this;
}

export type ForkType = "container" | "request";
