import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { ResolverInterface } from "./contracts/resolver.contract.js";
import { Registry } from "./registry.js";
import { ConstantResolver } from "./resolvers/constant-resolver.js";
import { Scope } from "./scope.js";

describe("Registry", function () {
  let mockResolver: ResolverInterface;
  let resolver: ResolverInterface;
  let registry: Registry;
  beforeEach(async function () {
    mockResolver = mock();
    resolver = instance(mockResolver);
    registry = new Registry();
  });
  afterEach(async function () {
    reset(mockResolver);
  });

  describe("get bindingMap", function () {
    it("should return binding map", async function () {
      expect(registry.bindingMap).to.be.an.instanceOf(Map);
    });
  });

  describe("get factory", function () {
    it("should return ResolverFactory", async function () {
      expect(registry.factory).to.have.property("createBindingResolver");
      expect(registry.factory).to.have.property("createCallableResolver");
      expect(registry.factory).to.have.property("createClassResolver");
      expect(registry.factory).to.have.property("createConstantResolver");
      expect(registry.factory).to.have.property("createFunctionResolver");
      expect(registry.factory).to.have.property("createTagResolver");
    });
  });

  describe("get tagMap", function () {
    it("should return tag map", async function () {
      expect(registry.tagMap).to.be.an.instanceOf(Map);
    });
  });

  describe("#clearResolverByBinding(binding)", function () {
    context("when there is binding", function () {
      it("should return self", async function () {
        registry.setResolverByBinding("test", resolver);

        const self = registry.clearResolverByBinding("test");
        expect(self).to.equal(registry);
      });
    });
    context("when there is no binding", function () {
      it("should return self", async function () {
        const self = registry.clearResolverByBinding("test");
        expect(self).to.equal(registry);
      });
    });
  });

  describe("#clearResolverByTags(tagSet, resolver)", function () {
    context("when there tags", function () {
      it("should return self", async function () {
        registry.setResolverByTags(new Set(["test"]), resolver);

        const self = registry.clearResolverByTags(new Set(["test"]), resolver);
        expect(self).to.equal(registry);
      });
    });
    context("when there tags #2", function () {
      it("should return self", async function () {
        registry.setResolverByTags(new Set(["test"]), resolver);
        registry.setResolverByTags(
          new Set(["test"]),
          new ConstantResolver(registry, true),
        );

        const self = registry.clearResolverByTags(new Set(["test"]), resolver);
        expect(self).to.equal(registry);
      });
    });
    context("when there no tags", function () {
      it("should return self", async function () {
        const self = registry.clearResolverByTags(new Set(["test"]), resolver);
        expect(self).to.equal(registry);
      });
    });
  });

  describe("#getResolverByBinding(binding)", function () {
    context("when there is binding", function () {
      it("should return resolver", async function () {
        registry.setResolverByBinding("test", resolver);

        const result = registry.getResolverByBinding("test");
        expect(result).to.not.be.undefined;
      });
    });
    context("when there is no binding", function () {
      it("should return undefined", async function () {
        const result = registry.getResolverByBinding("test");
        expect(result).to.be.undefined;
      });
    });
  });

  describe("#getResolverByTag(tag)", function () {
    context("when there is tags", function () {
      it("should return resolvers", async function () {
        registry.setResolverByTags(new Set(["test"]), resolver);

        const result = registry.getResolverByTag("test");
        expect(result).be.an("array");
      });
    });
    context("when there is no tags", function () {
      it("should return resolvers", async function () {
        const result = registry.getResolverByTag("test");
        expect(result).be.an("array");
      });
    });
  });

  describe("#resolve(resolvable, scope, ...args)", function () {
    context("when resolvable is callable", function () {
      it("should return result", async function () {
        registry.bind(Date).to(Date);

        const result = registry.resolve([Date, "getTime"], new Scope());
        expect(result).to.be.a("number");
      });
    });
    context("when resolvable is callable string", function () {
      it("should return result", async function () {
        registry.bind(Date).to(Date);
        registry.bind("Date").toAlias(Date);

        const result = registry.resolve("Date#getTime", new Scope());
        expect(result).to.be.a("number");
      });
    });
    context("when resolvable is target", function () {
      it("should return result", async function () {
        registry.bind(Date).to(Date);

        const result = registry.resolve(Date, new Scope());
        expect(result).to.be.an.instanceOf(Date);
      });
    });
  });

  describe("#setResolverByBinding(binding, resolver)", function () {
    context("when there is binding", function () {
      it("should return self", async function () {
        registry.setResolverByBinding("test", resolver);

        const self = registry.setResolverByBinding("test", resolver);
        expect(self).to.equal(registry);
      });
    });
    context("when there is no binding", function () {
      it("should return self", async function () {
        const self = registry.setResolverByBinding("test", resolver);
        expect(self).to.equal(registry);
      });
    });
  });

  describe("#setResolverByTag(tagSet, resolver)", function () {
    context("when there is tags", function () {
      it("should return self", async function () {
        registry.setResolverByTags(new Set(["test"]), resolver);

        const self = registry.setResolverByTags(new Set(["test"]), resolver);
        expect(self).to.equal(registry);
      });
    });
    context("when there is no tags", function () {
      it("should return self", async function () {
        const self = registry.setResolverByTags(new Set(["test"]), resolver);
        expect(self).to.equal(registry);
      });
    });
  });
});
