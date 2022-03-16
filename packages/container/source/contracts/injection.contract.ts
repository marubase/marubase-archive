import { RegistryBinding, RegistryTag } from "./registry.contract.js";

export type Injection =
  | InjectionBinding
  | InjectionClass
  | InjectionConstant
  | InjectionFunction
  | InjectionMethod
  | InjectionTag;

export type InjectionBinding = {
  binding: RegistryBinding;
  type: "binding";
};

export type InjectionClass = {
  target: Function;
  type: "class";
};

export type InjectionConstant = {
  constant: unknown;
  type: "constant";
};

export type InjectionFunction = {
  target: Function;
  type: "function";
};

export type InjectionMethod = {
  method: string | symbol;
  target: Function | Object;
  type: "method";
};

export type InjectionTag = {
  tag: RegistryTag;
  type: "tag";
};
