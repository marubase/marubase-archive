import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";

describe("toBufferReadable(buffer, options)", function () {
  context("when buffer is ArrayBuffer", function () {
    it("should return buffer readable", async function () {
      const arrayBuffer = new ArrayBuffer(4096 * 8);
      const buffer = Buffer.from(arrayBuffer).fill("A");

      const bufferChunks: Buffer[] = [];
      const readable = toBufferReadable(arrayBuffer);
      for await (const bufferChunk of readable) bufferChunks.push(bufferChunk);

      const bufferText = Buffer.concat(bufferChunks).toString("utf8");
      expect(bufferText).to.equal(buffer.toString("utf8"));
    });
  });
  context("when buffer is typed array", function () {
    it("should return buffer readable", async function () {
      const arrayBuffer = new ArrayBuffer(4096 * 8);
      const buffer = Buffer.from(arrayBuffer).fill("A");

      const bufferChunks: Buffer[] = [];
      const readable = toBufferReadable(buffer);
      for await (const bufferChunk of readable) bufferChunks.push(bufferChunk);

      const bufferText = Buffer.concat(bufferChunks).toString("utf8");
      expect(bufferText).to.equal(buffer.toString("utf8"));
    });
  });
  context("when buffer is string", function () {
    it("should return buffer readable", async function () {
      const arrayBuffer = new ArrayBuffer(4096 * 8);
      const buffer = Buffer.from(arrayBuffer).fill("A");

      const bufferChunks: Buffer[] = [];
      const readable = toBufferReadable(buffer.toString("utf8"));
      for await (const bufferChunk of readable) bufferChunks.push(bufferChunk);

      const bufferText = Buffer.concat(bufferChunks).toString("utf8");
      expect(bufferText).to.equal(buffer.toString("utf8"));
    });
  });
});
