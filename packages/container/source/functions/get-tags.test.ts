import { expect } from "chai";
import { RegistryTag } from "../contracts/registry.contract.js";
import { getTags } from "./get-tags.js";
import { setTags } from "./set-tags.js";

describe("getTags(target)", function () {
  context("when there is tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setTags(["test"], targetClass);
    });
    it("should return tags", async function () {
      const returnTags = getTags(targetClass);
      const testTags = ["test"];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
  context("when there is no tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should return tags", async function () {
      const returnTags = getTags(targetClass);
      const testTags: RegistryTag[] = [];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
});

describe("getTags(target, propertyKey)", function () {
  context("when there is tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };

      setTags(["test"], targetClass.prototype, "test");
    });
    it("should return tags", async function () {
      const returnTags = getTags(targetClass.prototype, "test");
      const testTags = ["test"];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
  context("when there is no tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {
        public test(): boolean {
          return true;
        }
      };
    });
    it("should return tags", async function () {
      const returnTags = getTags(targetClass.prototype, "test");
      const testTags: RegistryTag[] = [];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
});
