import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { FunctionResolver } from "./function-resolver.js";

describe("FunctionResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let scope: ScopeInterface;
  let functionResolver: FunctionResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    functionResolver = new FunctionResolver(registry, () => true);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return result", async function () {
      const result = functionResolver.resolve(scope);
      expect(result).to.be.true;
    });
  });
});
