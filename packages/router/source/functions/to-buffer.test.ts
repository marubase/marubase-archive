import { expect } from "chai";
import { Readable } from "stream";
import { toBuffer } from "./to-buffer.js";

describe("toBuffer(readable)", function () {
  context("when buffer readable is given", function () {
    it("should return buffer", async function () {
      const readable = new Readable();
      readable.push("hello, world", "utf8");
      readable.push(null);

      const buffer = await toBuffer(readable);
      expect(buffer.toString("utf8")).to.equal("hello, world");
    });
  });
});
