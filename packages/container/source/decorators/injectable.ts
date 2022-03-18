export function injectable(): ClassDecorator & MethodDecorator {
  const metadataKey = "container:injectable";
  return Reflect.metadata(metadataKey, true);
}
