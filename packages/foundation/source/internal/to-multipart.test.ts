import { expect } from "chai";
import { Readable } from "stream";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toMessage } from "./to-message.js";
import { toMultipart } from "./to-multipart.js";

describe("toMultipart(boundary, readable)", function () {
  context("when multipart readable have multiple parts", function () {
    it("should return multipart", async function () {
      const rawBody = Buffer.alloc(4096 * 8)
        .fill("A")
        .toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary--`;
      rawMultipart += `epilogue`;

      const boundary = "boundary";
      const readable = toBufferReadable(rawMultipart);

      for await (const part of toMultipart(boundary, readable)) {
        const { body, headers } = await toMessage(part);
        expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

        const bodyChunks: Buffer[] = [];
        for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

        const bodyBuffer = Buffer.concat(bodyChunks);
        const bodyText = bodyBuffer.toString("utf8");
        expect(bodyText).to.equal(rawBody);
      }
    });
  });
  context("when multipart readable have single part", function () {
    it("should return multipart", async function () {
      const rawBody = Buffer.alloc(4096 * 8)
        .fill("A")
        .toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary--`;
      rawMultipart += `epilogue`;

      const boundary = "boundary";
      const readable = toBufferReadable(rawMultipart);

      for await (const part of toMultipart(boundary, readable)) {
        const { body, headers } = await toMessage(part);
        expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

        const bodyChunks: Buffer[] = [];
        for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

        const bodyBuffer = Buffer.concat(bodyChunks);
        const bodyText = bodyBuffer.toString("utf8");
        expect(bodyText).to.equal(rawBody);
      }
    });
  });
  context("when multipart readable have small part", function () {
    it("should return multipart", async function () {
      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += "hello, world";
      rawMultipart += `\r\n--boundary--`;
      rawMultipart += `epilogue`;

      const boundary = "boundary";
      const readable = toBufferReadable(rawMultipart);

      for await (const part of toMultipart(boundary, readable)) {
        const { body, headers } = await toMessage(part);
        expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

        const bodyChunks: Buffer[] = [];
        for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

        const bodyBuffer = Buffer.concat(bodyChunks);
        const bodyText = bodyBuffer.toString("utf8");
        expect(bodyText).to.equal("hello, world");
      }
    });
  });
  context("when multipart readable end prematurely", function () {
    it("should throw error", async function () {
      const rawBody = Buffer.alloc(4096 * 8)
        .fill("A")
        .toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;

      const boundary = "boundary";
      const readable = new Readable({
        read() {
          this.push(null);
        },
      });
      readable.push(rawMultipart);

      try {
        for await (const part of toMultipart(boundary, readable)) {
          const { body, headers } = await toMessage(part);
          expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

          const bodyChunks: Buffer[] = [];
          for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

          const bodyBuffer = Buffer.concat(bodyChunks);
          const bodyText = bodyBuffer.toString("utf8");
          expect(bodyText).to.equal(rawBody);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
  context("when multipart readable throw error", function () {
    it("should throw error", async function () {
      const rawBody = Buffer.alloc(4096 * 8)
        .fill("A")
        .toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += rawBody;

      const boundary = "boundary";
      const readable = new Readable({
        read() {
          const error = new Error("test error");
          this.destroy(error);
        },
      });
      readable.push(rawMultipart);

      try {
        for await (const part of toMultipart(boundary, readable)) {
          const { body, headers } = await toMessage(part);
          expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

          const bodyChunks: Buffer[] = [];
          for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

          const bodyBuffer = Buffer.concat(bodyChunks);
          const bodyText = bodyBuffer.toString("utf8");
          expect(bodyText).to.equal(rawBody);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
