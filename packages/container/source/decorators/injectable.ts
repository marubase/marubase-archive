import { setInjectable } from "../functions/set-injectable.js";

export function injectable(): ClassDecorator & MethodDecorator {
  return (target: Function | Object, propertyKey?: string | symbol) =>
    setInjectable(true, target, propertyKey);
}
