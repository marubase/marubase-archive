import { expect } from "chai";
import { getScope } from "./get-scope.js";
import { setScope } from "./set-scope.js";

describe("setScope(scope, target)", function () {
  context("when there is scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setScope("container", targetClass);
    });
    it("should set scope", async function () {
      setScope("request", targetClass);

      const returnScope = getScope(targetClass);
      expect(returnScope).to.equal("request");
    });
  });
  context("when there is no scope", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should set scope", async function () {
      setScope("request", targetClass);

      const returnScope = getScope(targetClass);
      expect(returnScope).to.equal("request");
    });
  });
});

describe("setScope(scope, target, propertyKey)", function () {
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
    it("should set scope", async function () {
      setScope("request", targetClass.prototype, "test");

      const returnScope = getScope(targetClass.prototype, "test");
      expect(returnScope).to.equal("request");
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
    it("should set scope", async function () {
      setScope("request", targetClass.prototype, "test");

      const returnScope = getScope(targetClass.prototype, "test");
      expect(returnScope).to.equal("request");
    });
  });
});
