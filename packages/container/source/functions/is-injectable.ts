export function isInjectable(
  target: Function | Object,
  propertyKey?: string | symbol,
): boolean {
  const metadataKey = "container:injectable";
  return typeof propertyKey !== "undefined"
    ? Reflect.hasMetadata(metadataKey, target, propertyKey)
    : Reflect.hasMetadata(metadataKey, target);
}
