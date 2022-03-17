import { Cache } from "./cache.js";
import { CacheInterface } from "./contracts/cache.contract.js";
import { ScopeInterface, ScopeType } from "./contracts/scope.contract.js";

export class Scope implements ScopeInterface {
  protected _container: CacheInterface;

  protected _request: CacheInterface;

  protected _singleton: CacheInterface;

  public constructor(
    singleton?: CacheInterface,
    container?: CacheInterface,
    request?: CacheInterface,
  ) {
    this._singleton = singleton || new Cache();
    this._container = container || new Cache();
    this._request = request || new Cache();
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

  public fork(type: ScopeType): this {
    const Static = this.constructor as typeof Scope;
    return type !== "container"
      ? (new Static(this._singleton, this._container) as this)
      : (new Static(this._singleton) as this);
  }
}
