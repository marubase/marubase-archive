import { CacheContract } from "./cache.contract.js";

export interface ScopeContract {
  readonly container: CacheContract;

  readonly request: CacheContract;

  readonly singleton: CacheContract;

  fork(type: ForkType): this;
}

export type ForkType = "container" | "request";
