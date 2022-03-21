import { ResolverScope } from "../contracts/resolver.contract.js";

export function getScope(
  target: Function | Object,
  propertyKey?: string | symbol,
): ResolverScope {
  const metadataKey = "container:scope";
  return typeof propertyKey !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, propertyKey) || "transient"
    : Reflect.getMetadata(metadataKey, target) || "transient";
}
