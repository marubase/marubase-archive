import { RegistryTag } from "../contracts/registry.contract.js";

export function setTags(
  metadataValue: RegistryTag[],
  target: Function | Object,
  propertyKey?: string | symbol,
): void {
  const metadataKey = "container:tags";
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}
