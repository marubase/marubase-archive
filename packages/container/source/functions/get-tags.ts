import { ResolvableTag } from "../contracts/registry.contract.js";

export function getTags(
  target: Function | Object,
  propertyKey?: string | symbol,
): ResolvableTag[] {
  const metadataKey = "container:tags";
  return typeof propertyKey !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, propertyKey) || []
    : Reflect.getMetadata(metadataKey, target) || [];
}
