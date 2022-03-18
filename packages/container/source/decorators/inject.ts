import { Injection } from "../functions/get-injections.js";
import { setInjections } from "../functions/set-injections.js";

export function inject(injection: Injection): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    setInjections(target, propertyKey, (injections) => {
      injections[parameterIndex] = injection;
      return injections;
    });
  };
}
