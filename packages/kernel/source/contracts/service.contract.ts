import { ManagerInterface } from "./manager.contract.js";
import { MessageProtocol } from "./message.contract.js";
import { MultipartInterface } from "./multipart.contract.js";
import { RequestInterface, RequestMethod } from "./request.contract.js";

export const ServiceContract = Symbol("ServiceContract");

export interface ServiceInterface {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly href: string;

  readonly manager: ManagerInterface;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly protocol: MessageProtocol;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  readonly url: URL;

  clearCredential(): this;

  clearHash(): this;

  clearQueries(): this;

  clearQuery(key: string): this;

  multipart(): MultipartInterface;

  request(method: RequestMethod, path: string): RequestInterface;

  setCredential(token: string): this;
  setCredential(username: string, password: string): this;

  setHash(hash: string): this;

  setHostname(hostname: string): this;

  setHref(href: string): this;

  setOrigin(origin: string): this;

  setPath(path: string): this;

  setPort(port: number): this;

  setProtocol(protocol: MessageProtocol): this;

  setQueries(queries: Record<string, string>): this;

  setQuery(key: string, value: string): this;

  setScheme(scheme: string): this;

  setUrl(input: string, base?: string): this;
  setUrl(url: URL): this;
}
