import { expect } from "chai";
import { getTags } from "../functions/get-tags.js";
import { tag } from "./tag.js";

describe("@tag(...tags)", function () {
  context("when tag decorating class", function () {
    it("should set class tag", async function () {
      @tag("tag0", "tag1")
      class Tester {}

      const actualTags = getTags(Tester);
      const expectedTags = ["tag0", "tag1"];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
  context("when tag decorating method", function () {
    it("should set method tag", async function () {
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
});
