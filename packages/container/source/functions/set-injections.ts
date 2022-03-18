import { getInjections, Injection } from "./get-injections.js";

export function setInjections(
  target: Function | Object,
  propertyKey: string | symbol | undefined,
  mutationFn: InjectionsMutationFn,
): void {
  const injections = getInjections(target, propertyKey);

  const metadataKey = "container:injections";
  const metadataValue = mutationFn(injections);
  if (typeof propertyKey !== "undefined") {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}

export type InjectionsMutationFn = (injections: Injection[]) => Injection[];
