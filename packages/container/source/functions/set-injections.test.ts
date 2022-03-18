import { expect } from "chai";
import { getInjections } from "./get-injections.js";
import { setInjections } from "./set-injections.js";

describe("setInjections(target, propertyKey, mutationFn)", function () {
  context("when invoke on class", function () {
    it("should set injections", async function () {
      class Tester {}

      setInjections(Tester, undefined, () => ["test"]);

      const actualInjections = getInjections(Tester);
      const expectedInjections = ["test"];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
  context("when invoke on method", function () {
    it("should set injections", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      setInjections(Tester.prototype, "test", () => ["test"]);

      const actualInjections = getInjections(Tester.prototype, "test");
      const expectedInjections = ["test"];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
});
