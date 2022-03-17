import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ClassResolver } from "./class-resolver.js";

describe("ClassResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let scope: ScopeInterface;
  let classResolver: ClassResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    classResolver = new ClassResolver(registry, Date);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return result", async function () {
      const result = classResolver.resolve(scope);
      expect(result).to.be.an.instanceOf(Date);
    });
  });
});
