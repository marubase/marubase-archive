import { expect } from "chai";
import { injectable } from "../decorators/injectable.js";
import { isInjectable } from "./is-injectable.js";

describe("isInjectable(target)", function () {
  context("given class is decorated", function () {
    it("should return true", async function () {
      @injectable()
      class Tester {}

      const actualIsInjectable = isInjectable(Tester);
      expect(actualIsInjectable).to.be.true;
    });
  });
  context("given class is not decorated", function () {
    it("should return false", async function () {
      class Tester {}

      const actualIsInjectable = isInjectable(Tester);
      expect(actualIsInjectable).to.be.false;
    });
  });
});

describe("isInjectable(target, propertyKey)", function () {
  context("given method is decorated", function () {
    it("should return true", async function () {
      class Tester {
        @injectable()
        public test(): void {
          return;
        }
      }

      const actualIsInjectable = isInjectable(Tester.prototype, "test");
      expect(actualIsInjectable).to.be.true;
    });
  });
  context("given method is not decorated", function () {
    it("should return false", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      const actualIsInjectable = isInjectable(Tester.prototype, "test");
      expect(actualIsInjectable).to.be.false;
    });
  });
});
