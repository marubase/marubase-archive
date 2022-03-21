import { expect } from "chai";
import { isInjectable } from "./is-injectable.js";
import { setInjectable } from "./set-injectable.js";

describe("setInjectable(injectable, target)", function () {
  context("when there is injectable", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setInjectable(false, targetClass);
    });
    it("should set injectable", async function () {
      setInjectable(true, targetClass);

      const returnIsInjectable = isInjectable(targetClass);
      expect(returnIsInjectable).to.be.true;
    });
  });
  context("when there is no injectable", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should set injectable", async function () {
      setInjectable(true, targetClass);

      const returnIsInjectable = isInjectable(targetClass);
      expect(returnIsInjectable).to.be.true;
    });
  });
});

describe("setInjectable(injectable, target, propertyKey)", function () {
  context("when there is injectable", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setInjectable(false, targetClass.prototype, "test");
    });
    it("should set injectable", async function () {
      setInjectable(true, targetClass.prototype, "test");

      const returnIsInjectable = isInjectable(targetClass.prototype, "test");
      expect(returnIsInjectable).to.be.true;
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
    it("should set injectable", async function () {
      setInjectable(true, targetClass.prototype, "test");

      const returnIsInjectable = isInjectable(targetClass.prototype, "test");
      expect(returnIsInjectable).to.be.true;
    });
  });
});
