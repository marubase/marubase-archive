import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toText } from "./to-text.js";

describe("toText(readable)", function () {
  it("should return text", async function () {
    const readable = toBufferReadable("ABC");

    const text = await toText(readable);
    expect(text).to.equal("ABC");
  });
});
