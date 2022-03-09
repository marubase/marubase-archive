import { expect } from "chai";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toBuffer } from "./to-buffer.js";

describe("toBufferReadable(input)", function () {
  context("when input is ArrayBuffer", function () {
    it("should return readable stream", async function () {
      const input = new ArrayBuffer(3);
      Buffer.from(input).fill("ABC");

      const readable = toBufferReadable(input);
      expect(isReadable(readable)).to.be.true;

      const buffer = await toBuffer(readable);
      expect(buffer).to.deep.equal(Buffer.from([65, 66, 67]));
    });
  });
  context("when input is TypedArray", function () {
    it("should return readable stream", async function () {
      const input = Buffer.from("ABC", "utf8");

      const readable = toBufferReadable(input);
      expect(isReadable(readable)).to.be.true;

      const buffer = await toBuffer(readable);
      expect(buffer).to.deep.equal(Buffer.from([65, 66, 67]));
    });
  });
  context("when input is string", function () {
    it("should return readable stream", async function () {
      const input = "ABC";

      const readable = toBufferReadable(input);
      expect(isReadable(readable)).to.be.true;

      const buffer = await toBuffer(readable);
      expect(buffer).to.deep.equal(Buffer.from([65, 66, 67]));
    });
  });
  context("when input is too large", function () {
    it("should return readable stream", async function () {
      const input = Buffer.alloc(16384 * 4, 65);

      const readable = toBufferReadable(input);
      expect(isReadable(readable)).to.be.true;

      const buffer = await toBuffer(readable);
      expect(buffer).to.deep.equal(Buffer.alloc(16384 * 4, 65));
    });
  });
});
