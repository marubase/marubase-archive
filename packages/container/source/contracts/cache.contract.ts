import {
  RegistryBinding,
  RegistryEnv,
  RegistryMethod,
  RegistryTarget,
} from "./registry.contract.js";

export const CacheContract = Symbol("CacheContract");

export interface CacheInterface {
  readonly bindings: CacheEnvMap;

  clear(binding: RegistryBinding): this;

  fork(): this;

  get(binding: RegistryBinding): unknown | undefined;

  has(binding: RegistryBinding): boolean;

  set(binding: RegistryBinding, value: unknown): this;
}

export type CacheEnvMap = Map<RegistryEnv, CacheTargetMap>;

export type CacheTargetMap = Map<RegistryTarget, CacheMethodMap>;

export type CacheMethodMap = Map<RegistryMethod, unknown>;
