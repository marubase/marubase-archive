import { Cache } from "./cache.js";
import { CacheInterface } from "./contracts/cache.contract.js";
import { ForkType, ScopeInterface } from "./contracts/scope.contract.js";

export class Scope implements ScopeInterface {
  protected _container: CacheInterface;

  protected _request: CacheInterface;

  protected _singleton: CacheInterface;

  public constructor(
    singleton: CacheInterface = new Cache(),
    container: CacheInterface = new Cache(),
    request: CacheInterface = new Cache(),
  ) {
    this._singleton = singleton;
    this._container = container;
    this._request = request;
  }

  public get container(): CacheInterface {
    return this._container;
  }

  public get request(): CacheInterface {
    return this._request;
  }

  public get singleton(): CacheInterface {
    return this._singleton;
  }

  public fork(type: ForkType): this {
    const Static = this.constructor as typeof Scope;
    return type !== "container"
      ? (new Static(this._singleton, this._container) as this)
      : (new Static(this._singleton) as this);
  }
}
