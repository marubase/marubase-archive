import { expect } from "chai";
import { scope } from "../decorators/scope.js";
import { getScope } from "./get-scope.js";

describe("getScope(target)", function () {
  context("given class with scope", function () {
    it("should return scope", async function () {
      @scope("container")
      class Tester {}

      const actualScope = getScope(Tester);
      const expectedScope = "container";
      expect(actualScope).to.equal(expectedScope);
    });
  });
  context("given class with no scope", function () {
    it("should return scope", async function () {
      class Tester {}

      const actualScope = getScope(Tester);
      const expectedScope = "transient";
      expect(actualScope).to.equal(expectedScope);
    });
  });
});

describe("getScope(target, propertyKey)", function () {
  context("given method with scope", function () {
    it("should return scope", async function () {
      class Tester {
        @scope("container")
        public test(): void {
          return;
        }
      }

      const actualScope = getScope(Tester.prototype, "test");
      const expectedScope = "container";
      expect(actualScope).to.equal(expectedScope);
    });
  });
  context("given method with no scope", function () {
    it("should return scope", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      const actualScope = getScope(Tester.prototype, "test");
      const expectedScope = "transient";
      expect(actualScope).to.equal(expectedScope);
    });
  });
});
