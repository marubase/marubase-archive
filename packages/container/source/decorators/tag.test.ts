import { expect } from "chai";
import { getTags } from "../functions/get-tags.js";
import { injectable } from "./injectable.js";
import { tag } from "./tag.js";

describe("@tag(...tags)", function () {
  it("should set injection", async function () {
    @injectable()
    @tag("tag0", "tag1")
    class Tester {
      @injectable()
      @tag("tag0", "tag1")
      public test(): void {
        return;
      }
    }

    const classTags = getTags(Tester);
    expect(classTags).to.deep.equal(["tag0", "tag1"]);

    const methodTags = getTags(Tester.prototype, "test");
    expect(methodTags).to.deep.equal(["tag0", "tag1"]);
  });
});
