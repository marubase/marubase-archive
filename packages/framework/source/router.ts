import { ContainerContract } from "@marubase/container";
import { ContextContract } from "./contracts/context.contract.js";
import { RequestContract } from "./contracts/request.contract.js";
import {
  ResponseContract,
  ResponseText,
} from "./contracts/response.contract.js";
import {
  NextFn,
  RouterContract,
  RouterHandler,
} from "./contracts/router.contract.js";

export class Router implements RouterContract {
  protected _container: ContainerContract;

  protected _handlers: RouterHandler[] = [];

  public constructor(container: ContainerContract) {
    this._container = container;
  }

  public get container(): ContainerContract {
    return this._container;
  }

  public dispatch(
    context: ContextContract,
    nextFn: NextFn,
  ): Promise<ResponseContract>;
  public dispatch(request: RequestContract): Promise<ResponseContract>;
  public dispatch(
    contextOrRequest: ContextContract | RequestContract,
    contextNextFn?: NextFn,
  ): Promise<ResponseContract> {
    const context = !("respondWith" in contextOrRequest)
      ? this._container.resolve<ContextContract>(
          "Context",
          this._container,
          contextOrRequest,
        )
      : contextOrRequest;

    const parentNextFn =
      typeof contextNextFn === "undefined"
        ? async (): Promise<ResponseContract> =>
            this._container
              .resolve<ResponseContract>("Response")
              .setStatusCode(500)
              .setBody({
                error: ResponseText[500],
                reason: "No route handler found.",
              })
        : contextNextFn;

    let handlerIndex = 0;
    const nextFn = (): Promise<ResponseContract> => {
      const handler = this._handlers[handlerIndex++];
      if (typeof handler === "undefined") return parentNextFn();
      return typeof handler !== "function"
        ? handler.dispatch(context, nextFn)
        : handler(context, nextFn);
    };
    return nextFn();
  }

  public handle(handler: RouterHandler): this {
    this._handlers.push(handler);
    return this;
  }
}
