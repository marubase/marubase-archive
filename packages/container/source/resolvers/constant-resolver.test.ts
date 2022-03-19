import { expect } from "chai";
import { instance, mock } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ConstantResolver } from "./constant-resolver.js";

describe("ConstantResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
  });

  describe("#resolve(scope, ...args)", function () {
    context("when constant is boolean", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instance(mockRegistry), true);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instance(mockScope));
        expect(returnInstance).to.equal(true);
      });
    });
    context("when constant is number", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instance(mockRegistry), 1);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instance(mockScope));
        expect(returnInstance).to.equal(1);
      });
    });
    context("when constant is string", function () {
      let resolver: ConstantResolver;
      beforeEach(async function () {
        resolver = new ConstantResolver(instance(mockRegistry), "test");
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instance(mockScope));
        expect(returnInstance).to.equal("test");
      });
    });
  });
});
