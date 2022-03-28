import { ContainerContract } from "@marubase/container";
import { ContextContract } from "./context.contract.js";
import { RequestContract } from "./request.contract.js";
import { ResponseContract } from "./response.contract.js";

export interface RouterContract {
  readonly container: ContainerContract;

  dispatch(context: ContextContract, nextFn: NextFn): Promise<ResponseContract>;
  dispatch(request: RequestContract): Promise<ResponseContract>;

  handle(handler: RouterHandler): this;
}

export type NextFn = () => Promise<ResponseContract>;

export type RouteHandler = (
  context: ContextContract,
  nextFn: NextFn,
) => Promise<ResponseContract>;

export type RouterHandler = RouterContract | RouteHandler;
