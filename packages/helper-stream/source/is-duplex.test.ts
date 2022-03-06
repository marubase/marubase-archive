import { expect } from "chai";
import { Duplex } from "stream";
import { isDuplex } from "./is-duplex.js";

describe("isDuplex(input)", function () {
  context("when input is duplex stream", function () {
    it("should return true", async function () {
      const input = new Duplex();
      expect(isDuplex(input)).to.be.true;
    });
  });
  context("when input is not duplex stream", function () {
    it("should return false", async function () {
      const input = null;
      expect(isDuplex(input)).to.be.false;
    });
  });
});
