import { expect } from "chai";
import { isInjectable } from "./is-injectable.js";
import { setInjectable } from "./set-injectable.js";

describe("isInjectable(target)", function () {
  context("when there is injectable and injectable is true", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjectable(true, targetClass);
    });
    it("should return true", async function () {
      const returnInjectable = isInjectable(targetClass);
      expect(returnInjectable).to.be.true;
    });
  });
  context("when there is injectable and injectable is false", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjectable(false, targetClass);
    });
    it("should return false", async function () {
      const returnInjectable = isInjectable(targetClass);
      expect(returnInjectable).to.be.false;
    });
  });
  context("when there is no injectable", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should return false", async function () {
      const returnInjectable = isInjectable(targetClass);
      expect(returnInjectable).to.be.false;
    });
  });
});

describe("isInjectable(target, propertyKey)", function () {
  context("when there is injectable and injectable is true", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjectable(true, targetClass.prototype, "test");
    });
    it("should return true", async function () {
      const returnInjectable = isInjectable(targetClass.prototype, "test");
      expect(returnInjectable).to.be.true;
    });
  });
  context("when there is injectable and injectable is false", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjectable(false, targetClass.prototype, "test");
    });
    it("should return false", async function () {
      const returnInjectable = isInjectable(targetClass.prototype, "test");
      expect(returnInjectable).to.be.false;
    });
  });
  context("when there is no injectable", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };
    });
    it("should return false", async function () {
      const returnInjectable = isInjectable(targetClass.prototype, "test");
      expect(returnInjectable).to.be.false;
    });
  });
});
