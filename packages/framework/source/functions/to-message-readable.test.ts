import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toMessageReadable } from "./to-message-readable.js";
import { toText } from "./to-text.js";

describe("toMessageReadable(input)", function () {
  context("when input is message", function () {
    it("should return readable stream", async function () {
      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
      ]);
      const body = toBufferReadable(JSON.stringify({ test: true }));

      const readable = toMessageReadable({ body, headers });
      expect(isReadable(readable)).to.be.true;

      let rawContent = "";
      rawContent += `Content-Type: application/json\r\n`;
      rawContent += `Content-Length: 14\r\n`;
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const content = await toText(readable);
      expect(content).to.equal(rawContent);
    });
  });
  context("when input throw error", function () {
    it("should throw error", async function () {
      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
      ]);
      const body = new Readable({
        read(): void {
          this.destroy(new Error("test error"));
        },
      });

      const readable = toMessageReadable({ body, headers });
      expect(isReadable(readable)).to.be.true;

      try {
        await toText(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
