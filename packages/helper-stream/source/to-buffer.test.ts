import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toBuffer } from "./to-buffer.js";

describe("toBuffer(readable)", function () {
  it("should return buffer", async function () {
    const readable = toBufferReadable(Buffer.from("ABC", "utf8"));

    const buffer = await toBuffer(readable);
    expect(buffer).to.deep.equal(Buffer.from([65, 66, 67]));
  });
});
