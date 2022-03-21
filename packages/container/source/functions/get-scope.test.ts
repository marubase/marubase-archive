import { expect } from "chai";
import { getScope } from "./get-scope.js";
import { setScope } from "./set-scope.js";

describe("getScope(target)", function () {
  context("when there is scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setScope("container", targetClass);
    });
    it("should return scope", async function () {
      const returnScope = getScope(targetClass);
      expect(returnScope).to.equal("container");
    });
  });
  context("when there is no scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should return 'transient'", async function () {
      const returnScope = getScope(targetClass);
      expect(returnScope).to.equal("transient");
    });
  });
});

describe("getScope(target, propertyKey)", function () {
  context("when there is scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setScope("container", targetClass.prototype, "test");
    });
    it("should return scope", async function () {
      const returnScope = getScope(targetClass.prototype, "test");
      expect(returnScope).to.equal("container");
    });
  });
  context("when there is no scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };
    });
    it("should return 'transient'", async function () {
      const returnScope = getScope(targetClass.prototype, "test");
      expect(returnScope).to.equal("transient");
    });
  });
});
