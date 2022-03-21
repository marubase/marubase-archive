import { RegistryTag } from "../contracts/registry.contract.js";
import { setTags } from "../functions/set-tags.js";

export function tag(...tags: RegistryTag[]): ClassDecorator & MethodDecorator {
  return (target: Function | Object, propertyKey?: string | symbol) =>
    setTags(tags, target, propertyKey);
}
