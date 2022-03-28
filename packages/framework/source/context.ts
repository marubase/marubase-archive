import {
  ContainerContract,
  RegistryTag,
  Resolvable,
} from "@marubase/container";
import { ContextContract } from "./contracts/context.contract.js";
import { MessageProtocol } from "./contracts/message.contract.js";
import {
  RequestContract,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseCode,
  ResponseContract,
} from "./contracts/response.contract.js";

export class Context extends Map<unknown, unknown> implements ContextContract {
  protected _container: ContainerContract;

  protected _request: RequestContract;

  public constructor(container: ContainerContract, request: RequestContract) {
    super();
    this._container = container;
    this._request = request;
  }

  public get container(): ContainerContract {
    return this._container;
  }

  public get credential(): [string, string] | string | undefined {
    return this._request.credential;
  }

  public get hash(): string {
    return this._request.hash;
  }

  public get hostname(): string {
    return this._request.hostname;
  }

  public get href(): string {
    return this._request.href;
  }

  public get method(): RequestMethod {
    return this._request.method;
  }

  public get origin(): string {
    return this._request.origin;
  }

  public get path(): string {
    return this._request.path;
  }

  public get port(): number {
    return this._request.port;
  }

  public get protocol(): MessageProtocol {
    return this._request.protocol;
  }

  public get queries(): Record<string, string> {
    return this._request.queries;
  }

  public get request(): RequestContract {
    return this._request;
  }

  public get scheme(): string {
    return this._request.scheme;
  }

  public get url(): URL {
    return this._request.url;
  }

  public call<Result>(targetFn: Function, ...args: unknown[]): Result {
    return this._container.call(targetFn, ...args);
  }

  public create<Result>(targetClass: Function, ...args: unknown[]): Result {
    return this._container.create(targetClass, ...args);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._container.resolve(resolvable, ...args);
  }

  public resolveTag<Result>(tag: RegistryTag, ...args: unknown[]): Result[] {
    return this._container.resolveTag(tag, ...args);
  }

  public respondWith(
    statusCode: ResponseCode,
    statusText?: string,
  ): ResponseContract {
    const response = this._container.resolve<ResponseContract>("Response");
    return typeof statusText !== "undefined"
      ? response.setStatusCode(statusCode).setStatusText(statusText)
      : response.setStatusCode(statusCode);
  }
}
