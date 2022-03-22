import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.contract.js";
import { ForkType, ScopeContract } from "./contracts/scope.contract.js";

export class Scope implements ScopeContract {
  protected _container: CacheContract;

  protected _request: CacheContract;

  protected _singleton: CacheContract;

  public constructor(
    singleton: CacheContract = new Cache(),
    container: CacheContract = new Cache(),
    request: CacheContract = new Cache(),
  ) {
    this._singleton = singleton;
    this._container = container;
    this._request = request;
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
