import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { RegistryKeyResolver } from "./registry-key-resolver.js";

describe("RegistryKeyResolver", function () {
  let mockCache: CacheContract;
  let mockRegistry: RegistryContract;
  let mockResolver: ResolverContract;
  let mockScope: ScopeContract;
  beforeEach(async function () {
    mockCache = mock();
    mockRegistry = mock();
    mockScope = mock();
    mockResolver = mock();
  });

  describe("#resolve(scope, ...args)", function () {
    context("when scope is 'transient'", function () {
      let proxy: ResolverContract;
      let resolver: RegistryKeyResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instance(mockRegistry), "test");
        scope = instance(mockScope);
        proxy = instance(mockResolver);

        when(mockRegistry.getResolverByKey("test")).thenReturn(proxy);
        when(mockResolver.scope).thenReturn("transient");
        when(mockResolver.resolve<Date>(scope)).thenReturn(new Date());
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(scope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when scope is not 'transient' and is cache", function () {
      let cache: CacheContract;
      let proxy: ResolverContract;
      let resolver: RegistryKeyResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instance(mockRegistry), "test");
        cache = instance(mockCache);
        scope = instance(mockScope);
        proxy = instance(mockResolver);

        when(mockRegistry.getResolverByKey("test")).thenReturn(proxy);
        when(mockResolver.scope).thenReturn("container");
        when(mockScope.container).thenReturn(cache);
        when(mockCache.has("test")).thenReturn(true);
        when(mockCache.get("test")).thenReturn(new Date());
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(scope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when scope is not 'transient' and is not cache", function () {
      let cache: CacheContract;
      let proxy: ResolverContract;
      let resolver: RegistryKeyResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instance(mockRegistry), "test");
        cache = instance(mockCache);
        scope = instance(mockScope);
        proxy = instance(mockResolver);

        when(mockRegistry.getResolverByKey("test")).thenReturn(proxy);
        when(mockResolver.scope).thenReturn("container");
        when(mockScope.container).thenReturn(cache);
        when(mockCache.has("test")).thenReturn(false);

        const date = new Date();
        when(mockResolver.resolve<Date>(scope)).thenReturn(date);
        when(mockCache.set("test", date)).thenReturn(cache);
        when(mockCache.get("test")).thenReturn(date);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(scope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when target key is not found", function () {
      let resolver: RegistryKeyResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new RegistryKeyResolver(instance(mockRegistry), "test");
        scope = instance(mockScope);

        when(mockRegistry.getResolverByKey("test")).thenReturn(undefined);
      });
      it("should throw error", async function () {
        const run = (): unknown => resolver.resolve(scope);
        expect(run).to.throw(ContainerError);
      });
    });
  });
});
