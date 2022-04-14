import { ContainerInterface, ContainerProvider } from "@marubase/container";
import { MultipartContract } from "./contracts/multipart.contract.js";
import { Multipart } from "./multipart.js";

export class RouterProvider implements ContainerProvider {
  public install(container: ContainerInterface): void {
    container.bind(MultipartContract).to(Multipart);
  }

  public uninstall(container: ContainerInterface): void {
    container.resolver(MultipartContract)?.clearRegistryKey();
  }
}
