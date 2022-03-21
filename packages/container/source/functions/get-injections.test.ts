import { expect } from "chai";
import { RegistryKey } from "../contracts/registry.contract.js";
import { getInjections } from "./get-injections.js";
import { setInjections } from "./set-injections.js";

describe("getInjections(target)", function () {
  context("when there is injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjections(["test"], targetClass);
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass);
      const testInjections = ["test"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
  context("when there is paramtypes", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      const argInjections = ["test"];
      Reflect.defineMetadata("design:paramtypes", argInjections, targetClass);
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass);
      const testInjections = ["test"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
  context("when there is no injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass);
      const testInjections: (RegistryKey | undefined)[] = [];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
});

describe("getInjections(target, propertyKey)", function () {
  context("when there is injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjections(["test"], targetClass.prototype, "test");
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass.prototype, "test");
      const testInjections = ["test"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
  context("when there is paramtypes", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      const argInjections = ["test"];
      Reflect.defineMetadata("design:paramtypes", argInjections, targetClass.prototype, "test");
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass.prototype, "test");
      const testInjections = ["test"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
  context("when there is no injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };
    });
    it("should return injections", async function () {
      const returnInjections = getInjections(targetClass.prototype, "test");
      const testInjections: (RegistryKey | undefined)[] = [];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
});
