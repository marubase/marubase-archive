import { ResolverScope } from "../contracts/resolver.contract.js";
import { getScope } from "./get-scope.js";

export function setScope(
  target: Function | Object,
  propertyKey: string | symbol | undefined,
  mutationFn: ScopeMutationFn,
): void {
  const scope = getScope(target, propertyKey);

  const metadataKey = "container:scope";
  const metadataValue = mutationFn(scope);
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}

export type ScopeMutationFn = (scope: ResolverScope) => ResolverScope;
