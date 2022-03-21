import { ResolverScope } from "../contracts/resolver.contract.js";

export function setScope(
  metadataValue: ResolverScope,
  target: Function | Object,
  propertyKey?: string | symbol,
): void {
  const metadataKey = "container:scope";
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}
