import {
  RegistryBinding,
  RegistryInterface,
  Resolvable,
  ResolvableTarget,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ContainerContract = Symbol("ContainerContract");

export interface ContainerInterface {
  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(binding: ResolvableTarget): RegistryBinding;

  bound(binding: ResolvableTarget): boolean;

  fork(): this;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  unbind(binding: ResolvableTarget): this;
}
