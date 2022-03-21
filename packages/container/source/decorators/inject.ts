import { RegistryKey } from "../contracts/registry.contract.js";
import { getInjections } from "../functions/get-injections.js";
import { setInjections } from "../functions/set-injections.js";

export function inject(key: RegistryKey): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const injections = getInjections(target, propertyKey) as RegistryKey[];
    injections[parameterIndex] = key;
    setInjections(injections, target, propertyKey);
  };
}
