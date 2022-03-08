import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toTextData } from "./to-text-data.js";

describe("toTextData(readable)", function () {
  it("should return text", async function () {
    const readable = toBufferReadable("ABC");

    const text = await toTextData(readable);
    expect(text).to.equal("ABC");
  });
});
