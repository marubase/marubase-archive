import { ResolvableTag } from "../contracts/registry.contract.js";
import { setTags } from "../functions/set-tags.js";

export function tag(
  ...tags: ResolvableTag[]
): ClassDecorator & MethodDecorator {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    setTags(target, propertyKey, () => tags);
  };
}
