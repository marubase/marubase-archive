import { expect } from "chai";
import { getTags } from "./get-tags.js";
import { setTags } from "./set-tags.js";

describe("setTags(tags, target)", function () {
  context("when there is tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};

      setTags(["test"], targetClass);
    });
    it("should set tags", async function () {
      const argTags = ["tag"];
      setTags(argTags, targetClass);

      const returnTags = getTags(targetClass);
      const testTags = ["tag"];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
  context("when there is no tags", function () {
    let targetClass: Function;
    beforeEach(async function () {
      targetClass = class Tester {};
    });
    it("should set tags", async function () {
      const argTags = ["tag"];
      setTags(argTags, targetClass);

      const returnTags = getTags(targetClass);
      const testTags = ["tag"];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
});

describe("setTags(tags, target, propertyKey)", function () {
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
    it("should set tags", async function () {
      const argTags = ["tag"];
      setTags(argTags, targetClass.prototype, "test");

      const returnTags = getTags(targetClass.prototype, "test");
      const testTags = ["tag"];
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
    it("should set tags", async function () {
      const argTags = ["tag"];
      setTags(argTags, targetClass.prototype, "test");

      const returnTags = getTags(targetClass.prototype, "test");
      const testTags = ["tag"];
      expect(returnTags).to.deep.equal(testTags);
    });
  });
});
