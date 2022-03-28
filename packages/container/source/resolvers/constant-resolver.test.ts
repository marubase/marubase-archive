import { expect } from "chai";
import { instance, mock } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ConstantResolver } from "./constant-resolver.js";

describe("ConstantResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let instanceRegistry: RegistryInterface;
  let instanceScope: ScopeInterface;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    instanceRegistry = instance(mockRegistry);
    instanceScope = instance(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when constant is boolean", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instanceRegistry, true);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.equal(true);
      });
    });
    context("when constant is number", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instanceRegistry, Number.MAX_SAFE_INTEGER);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.equal(Number.MAX_SAFE_INTEGER);
      });
    });
    context("when constant is string", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instanceRegistry, "test");
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.equal("test");
      });
    });
  });
});
