import { ContainerInterface } from "@marubase/container";
import { ContextInterface } from "./context.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface {
  readonly container: ContainerInterface;

  configure(configureFn: ConfigureFn): void;

  dispatch(context: ContextInterface): Promise<ResponseInterface>;

  handle(handler: RouterHandler): void;

  router(): RouterInterface;
}

export type ConfigureFn = (router: RouterInterface) => void;

export type HandlerFn = (
  context: ContextInterface,
  nextFn: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;

export type RouterHandler = HandlerFn | RouterInterface;
