import { RegistryKey } from "../contracts/registry.contract.js";
import { getInjections } from "./get-injections.js";

export const NON_INJECTABLE: unknown[] = [
  Boolean,
  Number,
  Object,
  String,
  undefined,
];

export function getDependencies(
  target: Function | Object,
  propertyKey?: string | symbol,
): RegistryKey[] {
  const dependencies: RegistryKey[] = [];
  for (const injection of getInjections(target, propertyKey)) {
    if (NON_INJECTABLE.indexOf(injection) >= 0) break;
    dependencies.push(injection as RegistryKey);
  }
  return dependencies;
}
