import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { TagResolver } from "./tag-resolver.js";

describe("TagResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockResolver: ResolverInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let resolver: ResolverInterface;
  let scope: ScopeInterface;
  let tagResolver: TagResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockResolver = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    resolver = instance(mockResolver);
    scope = instance(mockScope);
    tagResolver = new TagResolver(registry, "test");
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockResolver);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return result", async function () {
      when(mockRegistry.getResolverByTag("test")).thenReturn([resolver]);
      when(mockResolver.resolve<boolean>(scope)).thenReturn(true);

      const result = tagResolver.resolve(scope);
      expect(result).to.deep.equal([true]);
    });
  });
});
