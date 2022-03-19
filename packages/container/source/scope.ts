import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.contract.js";
import { ForkType, ScopeContract } from "./contracts/scope.contract.js";

export class Scope implements ScopeContract {
  protected _container: CacheContract;

  protected _request: CacheContract;

  protected _singleton: CacheContract;

  public constructor(
    singleton?: CacheContract,
    container?: CacheContract,
    request?: CacheContract,
  ) {
    this._singleton = singleton || new Cache();
    this._container = container || new Cache();
    this._request = request || new Cache();
  }

  public get container(): CacheContract {
    return this._container;
  }

  public get request(): CacheContract {
    return this._request;
  }

  public get singleton(): CacheContract {
    return this._singleton;
  }

  public fork(type: ForkType): this {
    const Static = this.constructor as typeof Scope;
    return type !== "container"
      ? (new Static(this._singleton, this._container) as this)
      : (new Static(this._singleton) as this);
  }
}
