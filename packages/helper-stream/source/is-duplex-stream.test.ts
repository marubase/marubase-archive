import { expect } from "chai";
import { Duplex } from "stream";
import { isDuplexStream } from "./is-duplex-stream.js";

describe("isDuplexStream(input)", function () {
  context("when input is duplex stream", function () {
    it("should return true", async function () {
      const input = new Duplex();
      expect(isDuplexStream(input)).to.be.true;
    });
  });
  context("when input is not duplex stream", function () {
    it("should return false", async function () {
      const input = null;
      expect(isDuplexStream(input)).to.be.false;
    });
  });
});
