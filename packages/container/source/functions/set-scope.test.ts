import { expect } from "chai";
import { getScope } from "./get-scope.js";
import { setScope } from "./set-scope.js";

describe("setScope(target, propertyKey, mutationFn)", function () {
  context("when invoke on class", function () {
    it("should set scope", async function () {
      class Tester {}

      setScope(Tester, undefined, () => "container");

      const actualScope = getScope(Tester);
      const expectedScope = "container";
      expect(actualScope).to.equal(expectedScope);
    });
  });
  context("when invoke on method", function () {
    it("should set scope", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      setScope(Tester.prototype, "test", () => "container");

      const actualScope = getScope(Tester.prototype, "test");
      const expectedScope = "container";
      expect(actualScope).to.equal(expectedScope);
    });
  });
});
