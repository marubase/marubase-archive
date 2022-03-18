import { expect } from "chai";
import { ResolvableTarget } from "../contracts/registry.contract.js";
import { inject } from "../decorators/inject.js";
import { injectable } from "../decorators/injectable.js";
import { getDependencies } from "./get-dependencies.js";

describe("getDependencies(target)", function () {
  context("given class with resolvable injection", function () {
    it("should return dependencies", async function () {
      @injectable()
      class Tester {
        protected _test: boolean;
        public constructor(@inject("test") test: boolean) {
          this._test = test;
        }
      }

      const actualDependencies = getDependencies(Tester);
      const expectedDependencies = ["test"];
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });
  context("given class with scalar injection", function () {
    it("should return dependencies", async function () {
      @injectable()
      class Tester {
        protected _test: boolean;
        public constructor(test: boolean) {
          this._test = test;
        }
      }

      const actualDependencies = getDependencies(Tester);
      const expectedDependencies: ResolvableTarget[] = [];
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });
});

describe("getDependencies(target, propertyKey)", function () {
  context("given method with resolvable injection", function () {
    it("should return dependencies", async function () {
      class Tester {
        @injectable()
        public test(@inject("test") test: boolean): boolean {
          return test;
        }
      }

      const actualDependencies = getDependencies(Tester.prototype, "test");
      const expectedDependencies = ["test"];
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });
  context("given method with scalar injection", function () {
    it("should return dependencies", async function () {
      class Tester {
        @injectable()
        public test(test: boolean): boolean {
          return test;
        }
      }

      const actualDependencies = getDependencies(Tester.prototype, "test");
      const expectedDependencies: ResolvableTarget[] = [];
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });
});
