import { expect } from "chai";
import { getScope } from "../functions/get-scope.js";
import { scope } from "./scope.js";

describe("@scope(scope)", function () {
  context("when scope decorating class", function () {
    it("should set class scope", async function () {
      @scope("container")
      class Tester {}

      const actualScope = getScope(Tester);
      const expectedScope = "container";
      expect(actualScope).to.equal(expectedScope);
    });
  });
  context("when scope decorating method", function () {
    it("should set method scope", async function () {
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
});
