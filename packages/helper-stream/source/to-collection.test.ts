import { expect } from "chai";
import { toCollectionReadable } from "./to-collection-readable.js";
import { toCollection } from "./to-collection.js";

describe("toCollection(input)", function () {
  it("should return collection", async function () {
    const readable = toCollectionReadable([0, 1, 2]);

    const collection = await toCollection(readable);
    expect(collection).to.deep.equal([0, 1, 2]);
  });
});
