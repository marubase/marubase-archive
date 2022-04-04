import { expect } from "chai";
import { Readable } from "stream";
import { toMessageReadable } from "./to-message-readable.js";

describe("toMessageReadable(message, options", function () {
  context("when message have single header", function () {
    it("should return message readable", async function () {
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const message = { body, headers };
      const messageChunks: Buffer[] = [];
      for await (const messageChunk of toMessageReadable(message)) {
        messageChunks.push(messageChunk);
      }

      const messageBuffer = Buffer.concat(messageChunks);
      const messageText = messageBuffer.toString("utf8");

      let rawMessage = ``;
      rawMessage += `Content-Type: text/plain\r\n`;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;
      expect(messageText).to.equal(rawMessage);
    });
  });
  context("when message have multiple header", function () {
    it("should return message readable", async function () {
      const headers = new Map([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const message = { body, headers };
      const messageChunks: Buffer[] = [];
      for await (const messageChunk of toMessageReadable(message)) {
        messageChunks.push(messageChunk);
      }

      const messageBuffer = Buffer.concat(messageChunks);
      const messageText = messageBuffer.toString("utf8");

      let rawMessage = ``;
      rawMessage += `Content-Length: 12\r\n`;
      rawMessage += `Content-Type: text/plain\r\n`;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;
      expect(messageText).to.equal(rawMessage);
    });
  });
  context("when message have no header", function () {
    it("should return message readable", async function () {
      const headers = new Map<string, string>();
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const message = { body, headers };
      const messageChunks: Buffer[] = [];
      for await (const messageChunk of toMessageReadable(message)) {
        messageChunks.push(messageChunk);
      }

      const messageBuffer = Buffer.concat(messageChunks);
      const messageText = messageBuffer.toString("utf8");

      let rawMessage = ``;
      rawMessage += `\r\n`;
      rawMessage += `hello, world`;
      expect(messageText).to.equal(rawMessage);
    });
  });
  context("when message body throw error", function () {
    it("should throw error", async function () {
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable({
        read() {
          const error = new Error("test error");
          this.destroy(error);
        },
      });

      try {
        const message = { body, headers };
        const messageChunks: Buffer[] = [];
        for await (const messageChunk of toMessageReadable(message)) {
          messageChunks.push(messageChunk);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
