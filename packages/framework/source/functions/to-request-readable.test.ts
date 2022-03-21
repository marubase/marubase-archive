import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toRequestReadable } from "./to-request-readable.js";
import { toTextData } from "./to-text-data.js";

describe("toRequestReadable(input)", function () {
  context("when input is request", function () {
    it("should return readable stream", async function () {
      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
        ["Host", "127.0.0.1"],
      ]);
      const body = toBufferReadable(JSON.stringify({ test: true }));

      const readable = toRequestReadable({ body, headers });
      expect(isReadable(readable)).to.be.true;

      let rawContent = "GET / HTTP/1.1\r\n";
      rawContent += `Content-Length: 14\r\n`;
      rawContent += `Content-Type: application/json\r\n`;
      rawContent += `Host: 127.0.0.1\r\n`;
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const content = await toTextData(readable);
      expect(content).to.equal(rawContent);
    });
  });
  context("when input throw error", function () {
    it("should throw error", async function () {
      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
        ["Host", "127.0.0.1"],
      ]);
      const body = new Readable({
        read(): void {
          this.destroy(new Error("test error"));
        },
      });

      const readable = toRequestReadable({ body, headers });
      expect(isReadable(readable)).to.be.true;

      try {
        await toTextData(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
