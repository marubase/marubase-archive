import { expect } from "chai";
import { Readable } from "stream";
import { toMessage } from "./to-message.js";

describe("toMessage(readable)", function () {
  context("when message readable have single header", function () {
    it("should return message", async function () {
      let rawMessage = ``;
      rawMessage += `Content-Type: text/plain\r\n`;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;

      const readable = new Readable();
      readable.push(rawMessage, "utf8");
      readable.push(null);

      const { body, headers } = await toMessage(readable);
      expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when message readable have multiple header", function () {
    it("should return message", async function () {
      let rawMessage = ``;
      rawMessage += `Content-Length: 12\r\n`;
      rawMessage += `Content-Type: text/plain\r\n`;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;

      const readable = new Readable();
      readable.push(rawMessage, "utf8");
      readable.push(null);

      const { body, headers } = await toMessage(readable);
      expect(Array.from(headers)).to.deep.equal([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when message readable have no header", function () {
    it("should return message", async function () {
      let rawMessage = ``;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;

      const readable = new Readable();
      readable.push(rawMessage, "utf8");
      readable.push(null);

      const { body, headers } = await toMessage(readable);
      expect(Array.from(headers)).to.deep.equal([]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
});
