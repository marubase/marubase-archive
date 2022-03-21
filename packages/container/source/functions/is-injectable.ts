export function isInjectable(
  target: Function | Object,
  propertyKey?: string | symbol,
): boolean {
  const metadataKey = "container:injectable";
  if (typeof propertyKey !== "undefined") {
    return Reflect.getMetadata(metadataKey, target, propertyKey) || false;
  } else {
    return Reflect.getMetadata(metadataKey, target) || false;
  }
}
