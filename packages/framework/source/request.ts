import { Readable } from "stream";
import { MessageProtocol } from "./contracts/message.contract.js";
import {
  RequestContract,
  RequestMethod,
} from "./contracts/request.contract.js";
import { toRequestReadable } from "./functions/to-request-readable.js";
import { toRequest } from "./functions/to-request.js";
import { Message } from "./message.js";

export class Request extends Message implements RequestContract {
  public static async from(readable: Readable): Promise<Request> {
    const rawRequest = await toRequest(readable);
    return new Request()
      .setProtocol(rawRequest.protocol as MessageProtocol)
      .setMethod(rawRequest.method as RequestMethod)
      .setUrl(rawRequest.url)
      .setHeaders(rawRequest.headers)
      .setBody(rawRequest.body);
  }

  protected _method: RequestMethod = "GET";

  protected _url = new URL("/", "http://127.0.0.1");

  public get credential(): [string, string] | string | undefined {
    const { password, username } = this._url;
    return username !== ""
      ? password !== ""
        ? [username, password]
        : username
      : undefined;
  }

  public get hash(): string {
    return this._url.hash;
  }

  public get hostname(): string {
    return this._url.hostname;
  }

  public get href(): string {
    return this._url.href;
  }

  public get method(): RequestMethod {
    return this._method;
  }

  public get origin(): string {
    return this._url.origin;
  }

  public get path(): string {
    return this._url.pathname;
  }

  public get port(): number {
    if (this._url.port !== "") return parseInt(this._url.port);
    return this._url.protocol.startsWith("https") ? 443 : 80;
  }

  public get queries(): Record<string, string> {
    const queries = this._url.searchParams;
    return Object.fromEntries(queries.entries());
  }

  public get scheme(): string {
    return this._url.protocol;
  }

  public get url(): URL {
    return this._url;
  }

  public clearCredential(): this {
    this._url.password = "";
    this._url.username = "";
    return this;
  }

  public clearHash(): this {
    this._url.hash = "";
    return this;
  }

  public clearQueries(): this {
    const searchParams = new URLSearchParams();
    this._url.search = searchParams.toString();
    return this;
  }

  public clearQuery(key: string): this {
    this._url.searchParams.delete(key);
    return this;
  }

  public setCredential(token: string): this;
  public setCredential(username: string, password: string): this;
  public setCredential(tokenOrUsername: string, password?: string): this {
    this._url.username = tokenOrUsername;
    this._url.password = password || "";
    return this;
  }

  public setHash(hash: string): this {
    this._url.hash = hash;
    return this;
  }

  public setHostname(hostname: string): this {
    this._url.hostname = hostname;
    return this;
  }

  public setHref(href: string): this {
    this._url.href = href;
    return this;
  }

  public setMethod(method: RequestMethod): this {
    this._method = method;
    return this;
  }

  public setOrigin(origin: string): this {
    const { hash, pathname, search } = this._url;
    this._url = new URL(pathname + search + hash, origin);
    return this;
  }

  public setPath(path: string): this {
    this._url.pathname = path;
    return this;
  }

  public setPort(port: number): this {
    this._url.port = port.toString();
    return this;
  }

  public setQueries(queries: Record<string, string>): this {
    const searchParams = new URLSearchParams(queries);
    this._url.search = searchParams.toString();
    return this;
  }

  public setQuery(key: string, value: string): this {
    const searchParams = new URLSearchParams(this._url.search);
    searchParams.set(key, value);

    this._url.search = searchParams.toString();
    return this;
  }

  public setScheme(scheme: string): this {
    this._url.protocol = scheme;
    return this;
  }

  public setUrl(input: string, base?: string): this;
  public setUrl(url: URL): this;
  public setUrl(inputOrUrl: URL | string, base?: string): this {
    this._url = !(inputOrUrl instanceof URL)
      ? new URL(inputOrUrl, base)
      : inputOrUrl;
    return this;
  }

  public toStream(): Readable {
    return toRequestReadable({
      body: this.body,
      headers: this.headers,
      method: this.method,
      protocol: this.protocol,
      url: this.url,
    });
  }
}
