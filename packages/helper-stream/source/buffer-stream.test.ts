import { expect } from "chai";
import { BufferStream } from "./buffer-stream.js";

describe("BufferStream", function () {
  context("when input is array buffer", function () {
    it("should return readable stream", async function () {
      const input = new ArrayBuffer(3);
      const readable = new BufferStream(input);
      Buffer.from(input).fill("ABC");

      let buffer = "";
      for await (const chunk of readable.setEncoding("utf8")) buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
  context("when input is typed array", function () {
    it("should return readable stream", async function () {
      const input = Buffer.from([65, 66, 67]);
      const readable = new BufferStream(input);

      let buffer = "";
      for await (const chunk of readable.setEncoding("utf8")) buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
  context("when input is string", function () {
    it("should return readable stream", async function () {
      const input = "ABC";
      const readable = new BufferStream(input);

      let buffer = "";
      for await (const chunk of readable.setEncoding("utf8")) buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
});
