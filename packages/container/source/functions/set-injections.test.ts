import { expect } from "chai";
import { getInjections } from "./get-injections.js";
import { setInjections } from "./set-injections.js";

describe("setInjections(injections, target)", function () {
  context("when there is injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjections(["test"], targetClass);
    });
    it("should set injections", async function () {
      const argInjections = ["injection"];
      setInjections(argInjections, targetClass);

      const returnInjections = getInjections(targetClass);
      const testInjections = ["injection"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
  context("when there is no injections", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should set injections", async function () {
      const argInjections = ["injection"];
      setInjections(argInjections, targetClass);

      const returnInjections = getInjections(targetClass);
      const testInjections = ["injection"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
});

describe("setInjections(injections, target, propertyKey)", function () {
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
    it("should set injections", async function () {
      const argInjections = ["injection"];
      setInjections(argInjections, targetClass.prototype, "test");

      const returnInjections = getInjections(targetClass.prototype, "test");
      const testInjections = ["injection"];
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
    it("should set injections", async function () {
      const argInjections = ["injection"];
      setInjections(argInjections, targetClass.prototype, "test");

      const returnInjections = getInjections(targetClass.prototype, "test");
      const testInjections = ["injection"];
      expect(returnInjections).to.deep.equal(testInjections);
    });
  });
});
