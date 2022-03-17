import { expect } from "chai";
import { Container } from "./container.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
  });

  describe("get registry", function () {
    it("should return registry", async function () {
      expect(container.registry).to.be.an.instanceOf(Registry);
    });
  });

  describe("get scope", function () {
    it("should return scope", async function () {
      expect(container.scope).to.be.an.instanceOf(Scope);
    });
  });

  describe("#bind(binding)", function () {
    it("should return return registry binding", async function () {
      const registryBinding = container.bind(Date);
      expect(registryBinding).to.have.property("to");
      expect(registryBinding).to.have.property("toAlias");
      expect(registryBinding).to.have.property("toCallable");
      expect(registryBinding).to.have.property("toConstant");
      expect(registryBinding).to.have.property("toFunction");
      expect(registryBinding).to.have.property("toTag");
    });
  });

  describe("#bound(binding)", function () {
    it("should return false", async function () {
      const bound = container.bound(Date);
      expect(bound).to.be.false;
    });
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const fork = container.fork();
      expect(fork).to.be.an.instanceOf(Container);
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    it("should return result", async function () {
      container.bind(Date).to(Date);

      const result = container.resolve<Date>(Date);
      expect(result).to.be.an.instanceOf(Date);
    });
  });

  describe("#unbind(binding)", function () {
    it("should return self", async function () {
      const self = container.unbind(Date);
      expect(self).to.equal(container);
    });
  });
});
