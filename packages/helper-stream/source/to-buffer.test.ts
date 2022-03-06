import { expect } from "chai";
import { toBuffer } from "./to-buffer.js";
import { toReadable } from "./to-readable.js";

describe("toBuffer(stream)", function () {
  it("should return buffer", async function () {
    const readable = toReadable("hello, world");
    const buffer = await toBuffer(readable);
    expect(buffer).to.deep.equal(Buffer.from("hello, world"));
  });
});
