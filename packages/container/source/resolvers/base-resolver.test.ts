import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

describe("BaseResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let scope: ScopeInterface;
  let resolver: BaseResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new BaseResolver(registry);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("get binding", function () {
    it("should return binding", async function () {
      expect(resolver.binding).to.be.undefined;
    });
  });

  describe("get dependencies", function () {
    it("should return dependencies", async function () {
      expect(resolver.dependencies).to.be.an("array");
    });
  });

  describe("get registry", function () {
    it("should return registry", async function () {
      expect(resolver.registry).to.not.be.undefined;
    });
  });

  describe("get scope", function () {
    it("should return scope", async function () {
      expect(resolver.scope).to.equal("transient");
    });
  });

  describe("get tags", function () {
    it("should return tags", async function () {
      expect(resolver.tags).to.be.an("array");
    });
  });

  describe("#clearBinding()", function () {
    context("when there is binding", function () {
      it("should return self", async function () {
        when(mockRegistry.clearResolverByBinding(anything())).thenReturn(
          registry,
        );
        resolver.setBinding("test");

        const self = resolver.clearBinding();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no binding", function () {
      it("should return self", async function () {
        const self = resolver.clearBinding();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#clearDependencies()", function () {
    context("when there is dependencies", function () {
      it("should return self", async function () {
        resolver.setDependencies("test");

        const self = resolver.clearDependencies();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no dependencies", function () {
      it("should return self", async function () {
        const self = resolver.clearDependencies();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#clearTags()", function () {
    context("when there is tags", function () {
      it("should return self", async function () {
        resolver.setTags("test");

        const self = resolver.clearTags();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no tags", function () {
      it("should return self", async function () {
        const self = resolver.clearTags();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#resolve(scope, ...args)", function () {
    it("should throw error", async function () {
      const process = (): unknown => resolver.resolve(scope);
      expect(process).to.throw(ContainerError);
    });
  });

  describe("#resolveDependencies(scope, ...args)", function () {
    context("when there is dependencies", function () {
      it("should return instances", async function () {
        when(mockRegistry.resolve<boolean>("test", scope)).thenReturn(true);
        resolver.setDependencies("test");

        const instances = resolver.resolveDependencies(scope);
        expect(instances).to.deep.equal([true]);
      });
    });
    context("when there is no dependencies", function () {
      it("should return instances", async function () {
        const instances = resolver.resolveDependencies(scope);
        expect(instances).to.deep.equal([]);
      });
    });
  });

  describe("#setBinding(binding)", function () {
    context("when there is binding", function () {
      it("should return self", async function () {
        resolver.setBinding("test");

        const self = resolver.setBinding("test");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no binding", function () {
      it("should return self", async function () {
        const self = resolver.setBinding("test");
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setDependencies(...dependencies)", function () {
    context("when there is dependencies", function () {
      it("should return self", async function () {
        resolver.setDependencies("test");

        const self = resolver.setDependencies("test");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no dependencies", function () {
      it("should return self", async function () {
        const self = resolver.setDependencies("test");
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setScope(scope)", function () {
    context("when there is scope", function () {
      it("should return self", async function () {
        resolver.setScope("transient");

        const self = resolver.setScope("container");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no scope", function () {
      it("should return self", async function () {
        const self = resolver.setScope("container");
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setTags(...tags)", function () {
    context("when there is tags", function () {
      it("should return self", async function () {
        resolver.setTags("test");

        const self = resolver.setTags("test");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no tags", function () {
      it("should return self", async function () {
        const self = resolver.setTags("test");
        expect(self).to.equal(resolver);
      });
    });
  });
});
