import { ContextInterface } from "./context.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface<Context extends ContextInterface> {
  dispatch(context: Context): Promise<ResponseInterface>;

  use(handler: RouterHandler<Context>): void;
}

export type RouteHandler<Context extends ContextInterface> = (
  context: Context,
  nextFn: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;

export type RouterHandler<Context extends ContextInterface> =
  | RouteHandler<Context>
  | RouterInterface<Context>;
