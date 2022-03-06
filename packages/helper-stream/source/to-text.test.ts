import { expect } from "chai";
import { toReadable } from "./to-readable.js";
import { toText } from "./to-text.js";

describe("toText(stream)", function () {
  it("should return text", async function () {
    const readable = toReadable("hello, world");
    const text = await toText(readable);
    expect(text).to.equal("hello, world");
  });
});
