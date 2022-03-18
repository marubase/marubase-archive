import { ResolvableTarget } from "../contracts/registry.contract.js";

export function getInjections(
  target: Function | Object,
  propertyKey?: string | symbol,
): Injection[] {
  const metadataKey = "container:injections";
  const paramtypesKey = "design:paramtypes";
  return typeof propertyKey !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, propertyKey) ||
        Reflect.getMetadata(paramtypesKey, target, propertyKey) ||
        []
    : Reflect.getMetadata(metadataKey, target) ||
        Reflect.getMetadata(paramtypesKey, target) ||
        [];
}

export type Injection = ResolvableTarget | undefined;
