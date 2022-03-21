import { expect } from "chai";
import { RegistryKey } from "../contracts/registry.contract.js";
import { getDependencies } from "./get-dependencies.js";
import { setInjections } from "./set-injections.js";

describe("getDependencies(target)", function () {
  context("when target is injected with [injectable]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjections([Date], targetClass);
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass);
      const testDependencies = [Date];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is injected with [scalar]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjections([Boolean], targetClass);
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass);
      const testDependencies: RegistryKey[] = [];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is injected with [injectable, scalar]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjections([Date, Boolean], targetClass);
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass);
      const testDependencies = [Date];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is not injected", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass);
      const testDependencies: RegistryKey[] = [];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
});

describe("getDependencies(target, propertyKey)", function () {
  context("when target is injected with [injectable]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjections([Date], targetClass.prototype, "test");
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass.prototype, "test");
      const testDependencies = [Date];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is injected with [scalar]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjections([Boolean], targetClass.prototype, "test");
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass.prototype, "test");
      const testDependencies: RegistryKey[] = [];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is injected with [injectable, scalar]", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjections([Date, Boolean], targetClass.prototype, "test");
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass.prototype, "test");
      const testDependencies = [Date];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
  context("when target is not injected", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };
    });
    it("should return dependencies", async function () {
      const returnDependencies = getDependencies(targetClass.prototype, "test");
      const testDependencies: RegistryKey[] = [];
      expect(returnDependencies).to.deep.equal(testDependencies);
    });
  });
});
