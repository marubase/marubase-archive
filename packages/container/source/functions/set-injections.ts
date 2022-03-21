import { RegistryKey } from "../contracts/registry.contract.js";

export function setInjections(
  metadataValue: RegistryKey[],
  target: Function | Object,
  propertyKey?: string | symbol,
): void {
  const metadataKey = "container:injections";
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}
