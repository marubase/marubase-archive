import { ContainerInterface, ContainerProvider } from "@marubase/container";
import { MessageContract } from "./contracts/message.contract.js";
import { MultipartContract } from "./contracts/multipart.contract.js";
import { Message } from "./message.js";
import { Multipart } from "./multipart.js";

export class RouterProvider implements ContainerProvider {
  public install(container: ContainerInterface): void {
    container.bind(MessageContract).to(Message);
    container.bind(MultipartContract).to(Multipart);
  }

  public uninstall(container: ContainerInterface): void {
    container.resolver(MessageContract)?.clearRegistryKey();
    container.resolver(MultipartContract)?.clearRegistryKey();
  }
}
