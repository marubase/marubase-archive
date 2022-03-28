import { expect } from "chai";
import { instance, mock } from "ts-mockito";
import { RegistryInterface, RegistryKey, RegistryTag } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

describe("BaseResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let instanceRegistry: RegistryInterface;
  let instanceScope: ScopeInterface;
  let resolver: BaseResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    instanceRegistry = instance(mockRegistry);
    instanceScope = instance(mockScope);
    resolver = new BaseResolver(instanceRegistry);
  });

  describe("get dependencies", function () {
    context("when there is dependencies", function () {
      beforeEach(async function () {
        const argDeps = ["dep0", "dep1"];
        resolver.setDependencies(...argDeps);
      });
      it("should return dependencies", async function () {
        const returnDeps = resolver.dependencies;
        const testDeps = ["dep0", "dep1"];
        expect(returnDeps).to.deep.equal(testDeps);
      });
    });
    context("when there is no dependencies", function () {
      it("should return dependencies", async function () {
        const returnDeps = resolver.dependencies;
        const testDeps: RegistryKey[] = [];
        expect(returnDeps).to.deep.equal(testDeps);
      });
    });
  });

  describe("get registry", function () {
    it("should return registry", async function () {
      const returnRegistry = resolver.registry;
      expect(returnRegistry).to.not.be.undefined;
    });
  });

  describe("get registryKey", function () {
    context("when there is registry key", function () {
      beforeEach(async function () {
        resolver.setRegistryKey("test");
      });
      it("should return registry key", async function () {
        const returnRegKey = resolver.registryKey;
        expect(returnRegKey).to.equal("test");
      });
    });
    context("when there is no registryKey", function () {
      it("should return undefined", async function () {
        const returnRegKey = resolver.registryKey;
        expect(returnRegKey).to.be.undefined;
      });
    });
  });

  describe("get tags", function () {
    context("when there is tags", function () {
      beforeEach(async function () {
        const argTags = ["tag0", "tag1"];
        resolver.setRegistryTags(...argTags);
      });
      it("should return tags", async function () {
        const returnTags = resolver.registryTags;
        const testTags = ["tag0", "tag1"];
        expect(returnTags).to.deep.equal(testTags);
      });
    });
    context("when there is no tags", function () {
      it("should return tags", async function () {
        const returnTags = resolver.registryTags;
        const testTags: RegistryTag[] = [];
        expect(returnTags).to.deep.equal(testTags);
      });
    });
  });

  describe("get scope", function () {
    context("when scope is 'container'", function () {
      beforeEach(async function () {
        resolver.setScope("container");
      });
      it("should return 'container'", async function () {
        const returnScope = resolver.scope;
        expect(returnScope).to.equal("container");
      });
    });
    context("when scope is 'request'", function () {
      beforeEach(async function () {
        resolver.setScope("request");
      });
      it("should return 'request'", async function () {
        const returnScope = resolver.scope;
        expect(returnScope).to.equal("request");
      });
    });
    context("when scope is 'singleton'", function () {
      beforeEach(async function () {
        resolver.setScope("singleton");
      });
      it("should return 'singleton'", async function () {
        const returnScope = resolver.scope;
        expect(returnScope).to.equal("singleton");
      });
    });
    context("when scope is 'transient'", function () {
      it("should return 'transient'", async function () {
        const returnScope = resolver.scope;
        expect(returnScope).to.equal("transient");
      });
    });
  });

  describe("#clearDependencies()", function () {
    context("when there is dependencies", function () {
      beforeEach(async function () {
        const argDeps = ["dep0", "dep1"];
        resolver.setDependencies(...argDeps);
      });
      it("should return self", async function () {
        const returnSelf = resolver.clearDependencies();
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no dependencies", function () {
      it("should return self", async function () {
        const returnSelf = resolver.clearDependencies();
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#clearRegistryKey()", function () {
    context("when there is registry key", function () {
      beforeEach(async function () {
        resolver.setRegistryKey("test");
      });
      it("should return self", async function () {
        const returnSelf = resolver.clearRegistryKey();
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no registryKey", function () {
      it("should return self", async function () {
        const returnSelf = resolver.clearRegistryKey();
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#clearRegistryTags()", function () {
    context("when there is tags", function () {
      beforeEach(async function () {
        const argTags = ["tag0", "tag1"];
        resolver.setRegistryTags(...argTags);
      });
      it("should return self", async function () {
        const returnSelf = resolver.clearRegistryTags();
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no tags", function () {
      it("should return self", async function () {
        const returnSelf = resolver.clearRegistryTags();
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#resolve(scope, ...args)", function () {
    it("should throw error", async function () {
      const run = (): unknown => resolver.resolve(instanceScope);
      expect(run).to.throw(ContainerError);
    });
  });

  describe("#setDependencies(...dependencies)", function () {
    context("when there is dependencies", function () {
      beforeEach(async function () {
        const argDeps = ["dep0", "dep1"];
        resolver.setDependencies(...argDeps);
      });
      it("should return self", async function () {
        const argDeps = ["dep0", "dep1"];
        const returnSelf = resolver.setDependencies(...argDeps);
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no dependencies", function () {
      it("should return self", async function () {
        const argDeps = ["dep0", "dep1"];
        const returnSelf = resolver.setDependencies(...argDeps);
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#setRegistryKey(registryKey)", function () {
    context("when there is registry key", function () {
      beforeEach(async function () {
        resolver.setRegistryKey("test");
      });
      it("should return self", async function () {
        const returnSelf = resolver.setRegistryKey("test");
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no registry key", function () {
      it("should return self", async function () {
        const returnSelf = resolver.setRegistryKey("test");
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#setRegistryTags(...tags)", function () {
    context("when there is tags", function () {
      beforeEach(async function () {
        const argTags = ["tag0", "tag1"];
        resolver.setRegistryTags(...argTags);
      });
      it("should return self", async function () {
        const argTags = ["tag0", "tag1"];
        const returnSelf = resolver.setRegistryTags(...argTags);
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when there is no tags", function () {
      it("should return self", async function () {
        const argTags = ["tag0", "tag1"];
        const returnSelf = resolver.setRegistryTags(...argTags);
        expect(returnSelf).to.equal(resolver);
      });
    });
  });

  describe("#setScope(scope)", function () {
    context("when scope is 'container'", function () {
      beforeEach(async function () {
        resolver.setScope("container");
      });
      it("should return self", async function () {
        const returnSelf = resolver.setScope("container");
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when scope is 'request'", function () {
      beforeEach(async function () {
        resolver.setScope("request");
      });
      it("should return 'request'", async function () {
        const returnSelf = resolver.setScope("request");
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when scope is 'singleton'", function () {
      beforeEach(async function () {
        resolver.setScope("singleton");
      });
      it("should return 'singleton'", async function () {
        const returnSelf = resolver.setScope("singleton");
        expect(returnSelf).to.equal(resolver);
      });
    });
    context("when scope is 'transient'", function () {
      it("should return 'transient'", async function () {
        const returnSelf = resolver.setScope("transient");
        expect(returnSelf).to.equal(resolver);
      });
    });
  });
});
