import { RegistryKey } from "../contracts/registry.contract.js";

export function getInjections(
  target: Function | Object,
  propertyKey?: string | symbol,
): (RegistryKey | undefined)[] {
  const metadataKey = "container:injections";
  const paramtypeKey = "design:paramtypes";
  return typeof propertyKey !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, propertyKey) ||
        Reflect.getMetadata(paramtypeKey, target, propertyKey) ||
        []
    : Reflect.getMetadata(metadataKey, target) ||
        Reflect.getMetadata(paramtypeKey, target) ||
        [];
}
