import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toMessageReadable } from "./to-message-readable.js";
import { toMultipartReadable } from "./to-multipart-readable.js";
import { toTextData } from "./to-text-data.js";

describe("toMultipartReadable(input)", function () {
  context("when input is multipart", function () {
    it("should return readable stream", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      const parts: Readable[] = [
        toMessageReadable({
          body: toBufferReadable(JSON.stringify({ test: true })),
          headers: new Map([
            ["Content-Type", "application/json"],
            ["Content-Length", "14"],
          ]),
        }),
        toMessageReadable({
          body: toBufferReadable(JSON.stringify({ test: true })),
          headers: new Map([
            ["Content-Type", "application/json"],
            ["Content-Length", "14"],
          ]),
        }),
        toMessageReadable({
          body: toBufferReadable(JSON.stringify({ test: true })),
          headers: new Map([
            ["Content-Type", "application/json"],
            ["Content-Length", "14"],
          ]),
        }),
      ];

      const readable = toMultipartReadable({ boundary, parts });
      expect(isReadable(readable)).to.be.true;

      let rawContent = ``;
      rawContent += `--${boundary}\r\n`;
      rawContent += `Content-Length: 14\r\n`;
      rawContent += `Content-Type: application/json\r\n`;
      rawContent += `\r\n`;
      rawContent += `{"test":true}\r\n`;
      rawContent += `--${boundary}\r\n`;
      rawContent += `Content-Length: 14\r\n`;
      rawContent += `Content-Type: application/json\r\n`;
      rawContent += `\r\n`;
      rawContent += `{"test":true}\r\n`;
      rawContent += `--${boundary}\r\n`;
      rawContent += `Content-Length: 14\r\n`;
      rawContent += `Content-Type: application/json\r\n`;
      rawContent += `\r\n`;
      rawContent += `{"test":true}\r\n`;
      rawContent += `--${boundary}--`;

      const content = await toTextData(readable);
      expect(content).to.equal(rawContent);
    });
  });
  context("when input throw error", function () {
    it("should throw error", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
      ]);

      const body = new Readable({
        read() {
          this.destroy(new Error("test error"));
        },
      });

      const parts: Readable[] = [toMessageReadable({ body, headers })];

      const readable = toMultipartReadable({ boundary, parts });
      expect(isReadable(readable)).to.be.true;

      try {
        await toTextData(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
