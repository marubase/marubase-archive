import { ContainerInterface } from "@marubase/container";
import { RouterInterface } from "./router.contract.js";
import { ServiceInterface } from "./service.contract.js";

export const ManagerContract = Symbol("ManagerContract");

export interface ManagerInterface extends ContainerInterface, RouterInterface {
  configure(configureFn: ConfigureFn): this;

  router(): RouterInterface;

  service(input: string, base?: string): ServiceInterface;
  service(url: URL): ServiceInterface;
}

export type ConfigureFn = (manager: ManagerInterface) => void;
