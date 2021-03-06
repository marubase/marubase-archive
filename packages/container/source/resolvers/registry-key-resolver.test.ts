import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { CacheInterface } from "../contracts/cache.contract.js";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { RegistryKeyResolver } from "./registry-key-resolver.js";

describe("RegistryKeyResolver", function () {
  let mockCache: CacheInterface;
  let mockRegistry: RegistryInterface;
  let mockResolver: ResolverInterface;
  let mockScope: ScopeInterface;
  let instanceCache: CacheInterface;
  let instanceRegistry: RegistryInterface;
  let instanceResolver: ResolverInterface;
  let instanceScope: ScopeInterface;
  beforeEach(async function () {
    mockCache = mock();
    mockRegistry = mock();
    mockScope = mock();
    mockResolver = mock();
    instanceCache = instance(mockCache);
    instanceRegistry = instance(mockRegistry);
    instanceResolver = instance(mockResolver);
    instanceScope = instance(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when scope is 'transient'", function () {
      let resolver: RegistryKeyResolver;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instanceRegistry, "test");

        when(mockRegistry.getResolverByKey("test")).thenReturn(instanceResolver);
        when(mockResolver.scope).thenReturn("transient");
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(new Date());
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when scope is not 'transient' and is cache", function () {
      let resolver: RegistryKeyResolver;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instanceRegistry, "test");

        when(mockRegistry.getResolverByKey("test")).thenReturn(instanceResolver);
        when(mockResolver.scope).thenReturn("container");
        when(mockScope.container).thenReturn(instanceCache);
        when(mockCache.has("test")).thenReturn(true);
        when(mockCache.get("test")).thenReturn(new Date());
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when scope is not 'transient' and is not cache", function () {
      let resolver: RegistryKeyResolver;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instanceRegistry, "test");

        when(mockRegistry.getResolverByKey("test")).thenReturn(instanceResolver);
        when(mockResolver.scope).thenReturn("container");
        when(mockScope.container).thenReturn(instanceCache);
        when(mockCache.has("test")).thenReturn(false);

        const fixedDate = new Date();
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(fixedDate);
        when(mockCache.set("test", fixedDate)).thenReturn(instanceCache);
        when(mockCache.get("test")).thenReturn(fixedDate);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when target key is not found", function () {
      let resolver: RegistryKeyResolver;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instanceRegistry, "test");

        when(mockRegistry.getResolverByKey("test")).thenReturn(undefined);
      });
      it("should throw error", async function () {
        const run = (): unknown => resolver.resolve(instanceScope);
        expect(run).to.throw(ContainerError);
      });
    });
  });
});
