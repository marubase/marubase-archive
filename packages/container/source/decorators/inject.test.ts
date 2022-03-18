import { expect } from "chai";
import { getInjections } from "../functions/get-injections.js";
import { inject } from "./inject.js";
import { injectable } from "./injectable.js";

describe("@inject(injection)", function () {
  context("when inject decorating constructor parameter", function () {
    it("should inject dependency into constructor parameter", async function () {
      @injectable()
      class Tester {
        protected _test: boolean;
        public constructor(@inject("test") test: boolean) {
          this._test = test;
        }
      }

      const actualInjections = getInjections(Tester);
      const expectedInjections = ["test"];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
  context("when inject decorating method parameter", function () {
    it("should inject dependency into method parameter", async function () {
      @injectable()
      class Tester {
        public test(@inject("test") test: boolean): boolean {
          return test;
        }
      }

      const actualInjections = getInjections(Tester.prototype, "test");
      const expectedInjections = ["test"];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
});
