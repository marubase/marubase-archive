export function setInjectable(
  metadataValue: boolean,
  target: Function | Object,
  propertyKey?: string | symbol,
): void {
  const metadataKey = "container:injectable";
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}
