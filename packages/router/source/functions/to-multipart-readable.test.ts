import { expect } from "chai";
import { Readable } from "stream";
import { toMessageReadable } from "./to-message-readable.js";
import { toMultipartReadable } from "./to-multipart-readable.js";

describe("toMultipartReadable(multipart, options)", function () {
  context("when multipart have multiple parts", function () {
    it("should return multipart readable", async function () {
      const headers0 = new Map([["Content-Type", "text/plain"]]);
      const body0 = new Readable();
      body0.push("hello, world", "utf8");
      body0.push(null);

      const headers1 = new Map([["Content-Type", "text/plain"]]);
      const body1 = new Readable();
      body1.push("hello, world", "utf8");
      body1.push(null);

      const headers2 = new Map([["Content-Type", "text/plain"]]);
      const body2 = new Readable();
      body2.push("hello, world", "utf8");
      body2.push(null);

      const boundary = "boundary";
      const epilogue = "epilogue";
      const preamble = "preamble";
      const parts = [
        toMessageReadable({ headers: headers0, body: body0 }),
        toMessageReadable({ headers: headers1, body: body1 }),
        toMessageReadable({ headers: headers2, body: body2 }),
      ];

      const multipart = { boundary, epilogue, parts, preamble };
      const multipartChunks: Buffer[] = [];
      for await (const multipartChunk of toMultipartReadable(multipart)) {
        multipartChunks.push(multipartChunk);
      }

      const multipartBuffer = Buffer.concat(multipartChunks);
      const multipartText = multipartBuffer.toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += `hello, world`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += `hello, world`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += `hello, world`;
      rawMultipart += `\r\n--boundary--`;
      rawMultipart += `epilogue`;
      expect(multipartText).to.equal(rawMultipart);
    });
  });
  context("when multipart have single part", function () {
    it("should return multipart readable", async function () {
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const boundary = "boundary";
      const epilogue = "epilogue";
      const preamble = "preamble";
      const parts = [toMessageReadable({ headers, body })];

      const multipart = { boundary, epilogue, parts, preamble };
      const multipartChunks: Buffer[] = [];
      for await (const multipartChunk of toMultipartReadable(multipart)) {
        multipartChunks.push(multipartChunk);
      }

      const multipartBuffer = Buffer.concat(multipartChunks);
      const multipartText = multipartBuffer.toString("utf8");

      let rawMultipart = `preamble`;
      rawMultipart += `\r\n--boundary\r\n`;
      rawMultipart += `Content-Type: text/plain\r\n`;
      rawMultipart += `\r\n`;
      rawMultipart += `hello, world`;
      rawMultipart += `\r\n--boundary--`;
      rawMultipart += `epilogue`;
      expect(multipartText).to.equal(rawMultipart);
    });
  });
  context("when part body throw error", function () {
    it("should throw error", async function () {
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable({
        read() {
          const error = new Error("test error");
          this.destroy(error);
        },
      });

      const boundary = "boundary";
      const epilogue = "epilogue";
      const preamble = "preamble";
      const parts = [toMessageReadable({ headers, body })];

      try {
        const multipart = { boundary, epilogue, parts, preamble };
        const multipartChunks: Buffer[] = [];
        for await (const multipartChunk of toMultipartReadable(multipart)) {
          multipartChunks.push(multipartChunk);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
