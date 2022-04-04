import { expect } from "chai";
import { Readable } from "stream";
import { MessageRecord, toMessageReadable } from "./to-message-readable.js";

describe("toMessageReadable(message, options", function () {
  context("when message have single header", function () {
    let message: MessageRecord;
    beforeEach(async function () {
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      message = { body, headers };
    });
    it("should return message readable", async function () {
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
    let message: MessageRecord;
    beforeEach(async function () {
      const headers = new Map([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      message = { body, headers };
    });
    it("should return message readable", async function () {
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
    let message: MessageRecord;
    beforeEach(async function () {
      const headers = new Map<string, string>();
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      message = { body, headers };
    });
    it("should return message readable", async function () {
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
});
