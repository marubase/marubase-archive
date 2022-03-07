import { expect } from "chai";
import { Writable } from "stream";
import { isWritableStream } from "./is-writable-stream.js";

describe("isWritableStream(input)", function () {
  context("when input is writable stream", function () {
    it("should return true", async function () {
      const input = new Writable();
      expect(isWritableStream(input)).to.be.true;
    });
  });
  context("when input is not writable stream", function () {
    it("should return false", async function () {
      const input = null;
      expect(isWritableStream(input)).to.be.false;
    });
  });
});
