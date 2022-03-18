import { expect } from "chai";
import { getTags } from "./get-tags.js";
import { setTags } from "./set-tags.js";

describe("setTags(target, propertyKey, mutationFn)", function () {
  context("when invoke on class", function () {
    it("should set tags", async function () {
      class Tester {}

      setTags(Tester, undefined, () => ["tag0", "tag1"]);

      const actualTags = getTags(Tester);
      const expectedTags = ["tag0", "tag1"];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
  context("when invoke on method", function () {
    it("should set tags", async function () {
      class Tester {
        public test(): void {
          return;
        }
      }

      setTags(Tester.prototype, "test", () => ["tag0", "tag1"]);

      const actualTags = getTags(Tester.prototype, "test");
      const expectedTags = ["tag0", "tag1"];
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });
});
