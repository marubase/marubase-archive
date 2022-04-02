import { ContextInterface } from "./context.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface {
  dispatch(
    context: ContextInterface,
    nextFn?: NextFn,
  ): Promise<ResponseInterface>;

  use(handler: RouteHandler | RouterInterface): this;
  use(path: string, handler: RouteHandler | RouterInterface): this;
}

export type RouteHandler = (
  context: ContextInterface,
  nextFn: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;
