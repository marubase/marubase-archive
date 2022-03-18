import { ResolvableTag } from "../contracts/registry.contract.js";
import { getTags } from "./get-tags.js";

export function setTags(
  target: Function | Object,
  propertyKey: string | symbol | undefined,
  mutationFn: TagsMutationFn,
): void {
  const tags = getTags(target, propertyKey);

  const metadataKey = "container:tags";
  const metadataValue = mutationFn(tags);
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}

export type TagsMutationFn = (tags: ResolvableTag[]) => ResolvableTag[];
