import { expect } from "chai";
import { ResolvableTarget } from "../contracts/registry.contract.js";
import { inject } from "../decorators/inject.js";
import { injectable } from "../decorators/injectable.js";
import { getInjections } from "./get-injections.js";

describe("getInjections(target)", function () {
  context("given class with resolvable injection", function () {
    it("should return injections", async function () {
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
  context("given class with scalar injection", function () {
    it("should return injections", async function () {
      @injectable()
      class Tester {
        protected _test: boolean;
        public constructor(test: boolean) {
          this._test = test;
        }
      }

      const actualInjections = getInjections(Tester);
      const expectedInjections: ResolvableTarget[] = [Boolean];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
  context("given class is not injectable", function () {
    it("should return injections", async function () {
      class Tester {
        protected _test: boolean;
        public constructor(test: boolean) {
          this._test = test;
        }
      }

      const actualInjections = getInjections(Tester);
      const expectedInjections: ResolvableTarget[] = [];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
});

describe("getInjections(target, propertyKey)", function () {
  context("given method with resolvable injection", function () {
    it("should return injections", async function () {
      class Tester {
        @injectable()
        public test(@inject("test") test: boolean): boolean {
          return test;
        }
      }

      const actualInjections = getInjections(Tester.prototype, "test");
      const expectedInjections = ["test"];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
  context("given method with scalar injection", function () {
    it("should return injections", async function () {
      class Tester {
        @injectable()
        public test(test: boolean): boolean {
          return test;
        }
      }

      const actualInjections = getInjections(Tester.prototype, "test");
      const expectedInjections: ResolvableTarget[] = [Boolean];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
  context("given method is not injectable", function () {
    it("should return injections", async function () {
      class Tester {
        public test(test: boolean): boolean {
          return test;
        }
      }

      const actualInjections = getInjections(Tester.prototype, "test");
      const expectedInjections: ResolvableTarget[] = [];
      expect(actualInjections).to.deep.equal(expectedInjections);
    });
  });
});
