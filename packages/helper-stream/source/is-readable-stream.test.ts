import { expect } from "chai";
import { Readable } from "stream";
import { isReadableStream } from "./is-readable-stream.js";

describe("isReadableStream(input)", function () {
  context("when input is readable stream", function () {
    it("should return true", async function () {
      const input = new Readable();
      expect(isReadableStream(input)).to.be.true;
    });
  });
  context("when input is not readable stream", function () {
    it("should return false", async function () {
      const input = null;
      expect(isReadableStream(input)).to.be.false;
    });
  });
});
