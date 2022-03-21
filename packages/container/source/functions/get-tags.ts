import { RegistryTag } from "../contracts/registry.contract.js";

export function getTags(
  target: Function | Object,
  propertyKey?: string | symbol,
): RegistryTag[] {
  const metadataKey = "container:tags";
  return typeof propertyKey !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, propertyKey) || []
    : Reflect.getMetadata(metadataKey, target) || [];
}
