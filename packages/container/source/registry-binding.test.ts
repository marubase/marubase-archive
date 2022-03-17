import { expect } from "chai";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

describe("RegistryBinding", function () {
  let registry: Registry;
  beforeEach(async function () {
    registry = new Registry();
  });

  describe("#bind(binding).to(target)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind(Date).to(Date);
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<Date>(Date, new Scope());
      expect(result).to.be.an.instanceOf(Date);
    });
  });

  describe("#bind(binding).toAlias(alias)", function () {
    it("should return resolver", async function () {
      registry.bind(Date).to(Date);

      const resolver = registry.bind("alias").toAlias(Date);
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<Date>("alias", new Scope());
      expect(result).to.be.an.instanceOf(Date);
    });
  });

  describe("#bind(binding).toCallable(callable)", function () {
    it("should return resolver", async function () {
      registry.bind(Date).to(Date);

      const resolver = registry.bind("callable").toCallable([Date, "getTime"]);
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<number>("callable", new Scope());
      expect(result).to.be.a("number");
    });
  });

  describe("#bind(binding).toConstant(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("constant").toConstant(true);
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<boolean>("constant", new Scope());
      expect(result).to.be.true;
    });
  });

  describe("#bind(binding).toFunction(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("random").toFunction(() => true);
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<boolean>("random", new Scope());
      expect(result).to.be.true;
    });
  });

  describe("#bind(binding).toTag(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("tag").toTag("test");
      expect(resolver).to.have.property("resolve");

      const result = registry.resolve<boolean[]>("tag", new Scope());
      expect(result).to.be.an("array");
    });
  });

  describe("#bound(binding)", function () {
    context("when there is binding", function () {
      it("should return true", async function () {
        registry.bind(Date).to(Date);

        const bound = registry.bound(Date);
        expect(bound).to.be.true;
      });
    });
    context("when there is no binding", function () {
      it("should return false", async function () {
        const bound = registry.bound(Date);
        expect(bound).to.be.false;
      });
    });
  });

  describe("#unbind(binding)", function () {
    context("when there is binding", function () {
      it("should return self", async function () {
        registry.bind(Date).to(Date);

        const self = registry.unbind(Date);
        expect(self).to.equal(registry);
      });
    });
    context("when there is no binding", function () {
      it("should return false", async function () {
        const self = registry.unbind(Date);
        expect(self).to.equal(registry);
      });
    });
  });
});
