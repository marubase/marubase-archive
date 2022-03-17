import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { CacheInterface } from "../contracts/cache.contract.js";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BindingResolver } from "./binding-resolver.js";

describe("BindingResolver", function () {
  let mockCache: CacheInterface;
  let mockRegistry: RegistryInterface;
  let mockResolver: ResolverInterface;
  let mockScope: ScopeInterface;
  let cache: CacheInterface;
  let registry: RegistryInterface;
  let resolver: ResolverInterface;
  let scope: ScopeInterface;
  let bindingResolver: BindingResolver;
  beforeEach(async function () {
    mockCache = mock();
    mockRegistry = mock();
    mockResolver = mock();
    mockScope = mock();
    cache = instance(mockCache);
    registry = instance(mockRegistry);
    resolver = instance(mockResolver);
    scope = instance(mockScope);
    bindingResolver = new BindingResolver(registry, "test");
  });
  afterEach(async function () {
    reset(mockCache);
    reset(mockRegistry);
    reset(mockResolver);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is binding", function () {
      context("and scope is transient", function () {
        it("should return instance", async function () {
          when(mockRegistry.getResolverByBinding("test")).thenReturn(resolver);
          when(mockResolver.scope).thenReturn("transient");
          when(mockResolver.resolve<boolean>(scope)).thenReturn(true);

          const instance = bindingResolver.resolve(scope);
          expect(instance).to.be.true;
        });
      });
      context("and there is cache", function () {
        it("should return instance", async function () {
          when(mockRegistry.getResolverByBinding("test")).thenReturn(resolver);
          when(mockResolver.scope).thenReturn("container");
          when(mockScope.container).thenReturn(cache);
          when(mockCache.has("test")).thenReturn(true);
          when(mockCache.get("test")).thenReturn(true);

          const instance = bindingResolver.resolve(scope);
          expect(instance).to.be.true;
        });
      });
      context("and there is no cache", function () {
        it("should return instance", async function () {
          when(mockRegistry.getResolverByBinding("test")).thenReturn(resolver);
          when(mockResolver.scope).thenReturn("container");
          when(mockScope.container).thenReturn(cache);
          when(mockCache.has("test")).thenReturn(false);
          when(mockResolver.resolve<boolean>(scope)).thenReturn(true);
          when(mockCache.set("test", true)).thenReturn(cache);
          when(mockCache.get("test")).thenReturn(true);

          const instance = bindingResolver.resolve(scope);
          expect(instance).to.be.true;
        });
      });
    });
    context("when there is no binding", function () {
      context("and binding is string", function () {
        it("should throw error", async function () {
          when(mockRegistry.getResolverByBinding("test")).thenReturn(undefined);

          const process = (): unknown => bindingResolver.resolve(scope);
          expect(process).to.throw(ContainerError);
        });
      });
      context("and binding is symbol", function () {
        it("should throw error", async function () {
          when(
            mockRegistry.getResolverByBinding(Symbol.for("test")),
          ).thenReturn(undefined);

          bindingResolver = new BindingResolver(registry, Symbol.for("test"));
          const process = (): unknown => bindingResolver.resolve(scope);
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });
});
