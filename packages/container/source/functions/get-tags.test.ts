import { expect } from "chai";
import { ResolvableTag } from "../contracts/registry.contract.js";
import { tag } from "../decorators/tag.js";
import { getTags } from "./get-tags.js";

describe("getTags(target)", function () {
  context("given class is tagged", function () {
    it("should return tags", async function () {
      @tag("tag0", "tag1")
      class Tester {}

      const actualTags = getTags(Tester);
      const expectedTags = ["tag0", "tag1"];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
  context("given class is not tagged", function () {
    it("should return tags", async function () {
      class Tester {}

      const actualTags = getTags(Tester);
      const expectedTags: ResolvableTag[] = [];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
});

describe("getTags(target, propertyKey)", function () {
  context("given method is tagged", function () {
    it("should return tags", async function () {
      class Tester {
        @tag("tag0", "tag1")
        public test(): void {
          return;
        }
      }

      const actualTags = getTags(Tester.prototype, "test");
      const expectedTags = ["tag0", "tag1"];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
  context("given method is not tagged", function () {
    it("should return tags", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      const actualTags = getTags(Tester.prototype, "test");
      const expectedTags: ResolvableTag[] = [];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
});
