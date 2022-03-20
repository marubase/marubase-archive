import { expect } from "chai";
import { Container } from "./container.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";
import { Scope } from "./scope.js";

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
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

  describe("#fork()", function () {
    it("should return fork", async function () {
      const returnFork = container.fork();
      expect(returnFork).to.be.an.instanceOf(Container);
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
});
