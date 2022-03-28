import { expect } from "chai";
import { Container } from "./container.js";
import { Provider } from "./contracts/container.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";
import { Scope } from "./scope.js";

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
  });

  describe("get booted", function () {
    context("when container is booted", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return true", async function () {
        const returnBooted = container.booted;
        expect(returnBooted).to.be.true;
      });
    });
    context("when container is not booted", function () {
      it("should return false", async function () {
        const returnBooted = container.booted;
        expect(returnBooted).to.be.false;
      });
    });
  });

  describe("get providerMap", function () {
    context("when there is provider", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
      });
      it("should return provider map", async function () {
        const returnProviderMap = container.providerMap;
        expect(returnProviderMap).to.be.an.instanceOf(Map);
      });
    });
    context("when there is no provider", function () {
      it("should return provider map", async function () {
        const returnProviderMap = container.providerMap;
        expect(returnProviderMap).to.be.an.instanceOf(Map);
      });
    });
  });

  describe("get registry", function () {
    it("should return registry", async function () {
      const returnRegistry = container.registry;
      expect(returnRegistry).to.be.an.instanceOf(Registry);
    });
  });

  describe("get scope", function () {
    it("should return scope", async function () {
      const returnScope = container.scope;
      expect(returnScope).to.be.an.instanceOf(Scope);
    });
  });

  describe("#bind(key)", function () {
    it("should return registry binding fluent api", async function () {
      const returnFluentApi = container.bind("test");
      expect(returnFluentApi).to.have.property("to");
      expect(returnFluentApi).to.have.property("toAlias");
      expect(returnFluentApi).to.have.property("toCallable");
      expect(returnFluentApi).to.have.property("toConstant");
      expect(returnFluentApi).to.have.property("toFunction");
      expect(returnFluentApi).to.have.property("toSelf");
      expect(returnFluentApi).to.have.property("toTag");
    });
  });

  describe("#boot()", function () {
    context("when container is booted and provider with boot method is installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = { boot: () => Promise.resolve() };
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should boot container", async function () {
        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
    context("when container is booted and provider with no boot method is installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should boot container", async function () {
        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
    context("when container is booted and no provider is installed", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should boot container", async function () {
        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
    context("when container is not booted", function () {
      it("should boot container", async function () {
        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
  });

  describe("#call(targetFn, ...args)", function () {
    it("should return result", async function () {
      const testFn = (): Date => new Date();
      const returnResult = container.call(testFn);
      expect(returnResult).to.be.an.instanceOf(Date);
    });
  });

  describe("#create(targetFn, scope, ...args)", function () {
    it("should return result", async function () {
      const returnResult = container.create(Date);
      expect(returnResult).to.be.an.instanceOf(Date);
    });
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const returnFork = container.fork();
      expect(returnFork).to.be.an.instanceOf(Container);
    });
  });

  describe("#install(name, provider)", function () {
    context("when container is booted and provider have boot method and install method", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = { boot: () => Promise.resolve(), install: () => undefined };
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider have boot method only", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = { boot: () => Promise.resolve() };
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider have install method only", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = { install: () => undefined };
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider have no methods", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = {};
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is not booted and provider have install methods", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = { install: () => undefined };
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is not booted and provider have no install methods", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should return self", async function () {
        const argProvider: Provider = {};
        const returnSelf = container.install("provider", argProvider);
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container name already exists", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
      });
      it("should throw error", async function () {
        const argProvider: Provider = {};
        const run = (): unknown => container.install("provider", argProvider);
        expect(run).to.throw(ContainerError);
      });
    });
    context("when container name already exists (symbol)", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install(Symbol.for("provider"), argProvider);
      });
      it("should throw error", async function () {
        const argProvider: Provider = {};
        const run = (): unknown => container.install(Symbol.for("provider"), argProvider);
        expect(run).to.throw(ContainerError);
      });
    });
  });

  describe("#installed(name)", function () {
    context("when there is provider", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
      });
      it("should return true", async function () {
        const returnInstalled = container.installed("provider");
        expect(returnInstalled).to.be.true;
      });
    });
    context("when there is no provider", function () {
      it("should return false", async function () {
        const returnInstalled = container.installed("provider");
        expect(returnInstalled).to.be.false;
      });
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        container.bind(Date).toSelf();
      });
      it("should return resolved instance", async function () {
        const returnInstance = container.resolve(Date);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no record", function () {
      it("should throw error", async function () {
        const run = (): unknown => container.resolve(Date);
        expect(run).to.throw(ContainerError);
      });
    });
  });

  describe("#resolveTag(tag, ...args)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        container.bind(Date).toSelf().setRegistryTags("tag");
      });
      it("should return instances", async function () {
        const returnInstances = container.resolveTag("tag");
        expect(returnInstances).to.be.an("array");
        expect(returnInstances).to.have.lengthOf(1);
      });
    });
    context("when there is no record", function () {
      it("should return instances", async function () {
        const returnInstances = container.resolveTag("tag");
        expect(returnInstances).to.be.an("array");
        expect(returnInstances).to.have.lengthOf(0);
      });
    });
  });

  describe("#resolver(key)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        container.bind(Date).toSelf();
      });
      it("should return resolver", async function () {
        const returnResolver = container.resolver(Date);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return undefined", async function () {
        const returnResolver = container.resolver(Date);
        expect(returnResolver).to.be.undefined;
      });
    });
  });

  describe("#shutdown()", function () {
    context("when container is booted and provider with shutdown method is installed", function () {
      beforeEach(async function () {
        const provider: Provider = { shutdown: () => Promise.resolve() };
        container.install("provider", provider);
        await container.boot();
      });
      it("should shutdown container", async function () {
        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when container is booted and provider with no shutdown method is installed", function () {
      beforeEach(async function () {
        const provider: Provider = {};
        container.install("provider", provider);
        await container.boot();
      });
      it("should shutdown container", async function () {
        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when container is booted and no provider is installed", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should shutdown container", async function () {
        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when container is not booted", function () {
      it("should shutdown container", async function () {
        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
  });

  describe("#uninstall(name)", function () {
    context("when container is booted and provider with shutdown method and uninstall method installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = { shutdown: () => Promise.resolve(), uninstall: () => undefined };
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should return self", async function () {
        const returnSelf = container.uninstall("provider");
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider with shutdown method installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = { shutdown: () => Promise.resolve() };
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should return self", async function () {
        const returnSelf = container.uninstall("provider");
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider with uninstall method installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = { uninstall: () => undefined };
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should return self", async function () {
        const returnSelf = container.uninstall("provider");
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and provider with no method installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
        await container.boot();
      });
      it("should return self", async function () {
        const returnSelf = container.uninstall("provider");
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is not booted and provider is installed", function () {
      beforeEach(async function () {
        const argProvider: Provider = {};
        container.install("provider", argProvider);
      });
      it("should return self", async function () {
        const returnSelf = container.uninstall("provider");
        expect(returnSelf).to.equal(container);
      });
    });
    context("when container is booted and no provider installed", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should throw error", async function () {
        const run = (): unknown => container.uninstall("provider");
        expect(run).to.throw(ContainerError);
      });
    });
    context("when container is booted and no provider installed (symbol)", function () {
      beforeEach(async function () {
        await container.boot();
      });
      it("should throw error", async function () {
        const run = (): unknown => container.uninstall(Symbol.for("provider"));
        expect(run).to.throw(ContainerError);
      });
    });
  });
});
