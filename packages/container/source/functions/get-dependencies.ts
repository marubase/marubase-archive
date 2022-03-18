import { ResolvableTarget } from "../contracts/registry.contract.js";
import { getInjections } from "./get-injections.js";

const PROTECTED_TARGET: (ResolvableTarget | undefined)[] = [
  Boolean,
  Number,
  Object,
  String,
  undefined,
];

export function getDependencies(
  target: Function | Object,
  propertyKey?: string | symbol,
): ResolvableTarget[] {
  const dependencies: ResolvableTarget[] = [];
  for (const injection of getInjections(target, propertyKey)) {
    if (PROTECTED_TARGET.indexOf(injection) >= 0) break;
    dependencies.push(injection as ResolvableTarget);
  }
  return dependencies;
}
