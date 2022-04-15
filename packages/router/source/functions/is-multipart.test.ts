import { Container } from "@marubase/container";
import { expect } from "chai";
import { Multipart } from "../multipart.js";
import { isMultipart } from "./is-multipart.js";

describe("isMultipart(input)", function () {
  context("when input is multipart", function () {
    it("should return true", async function () {
      const input = new Multipart(new Container());
      expect(isMultipart(input)).to.be.true;
    });
  });
  context("when input is not multipart", function () {
    it("should return false", async function () {
      const input = null;
      expect(isMultipart(input)).to.be.false;
    });
  });
});
