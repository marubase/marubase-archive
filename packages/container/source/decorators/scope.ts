import { ResolverScope } from "../contracts/resolver.contract.js";
import { setScope } from "../functions/set-scope.js";

export function scope(scope: ResolverScope): ClassDecorator & MethodDecorator {
  return (target: Function | Object, propertyKey?: string | symbol) =>
    setScope(scope, target, propertyKey);
}
