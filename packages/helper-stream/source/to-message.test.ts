import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toJsonData } from "./to-json-data.js";
import { toMessageReadable } from "./to-message-readable.js";
import { toMessage } from "./to-message.js";

describe("toMessage(readable)", function () {
  context("when readable is a valid message stream", function () {
    it("should return message", async function () {
      let rawContent = "";
      for (let i = 0; i < 819; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const readable = toBufferReadable(rawContent);
      const { headers, body } = await toMessage(readable);
      expect(headers).to.be.instanceOf(Map);
      expect(isReadable(body)).to.be.true;

      const data = await toJsonData(body);
      expect(data).to.deep.equal({ test: true });
    });
  });
  context("when readable is not a valid message stream", function () {
    it("should return message", async function () {
      let rawContent = "";
      for (let i = 0; i < 820; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      try {
        const readable = toBufferReadable(rawContent);
        await toMessage(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
  context("when readable throw error", function () {
    it("should return message", async function () {
      const headers = new Map([
        ["Content-Type", "application/json"],
        ["Content-Length", "14"],
      ]);
      const body = new Readable({
        read(): void {
          this.destroy(new Error("test error"));
        },
      });

      try {
        const readable = toMessageReadable({ body, headers });
        await toMessage(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
