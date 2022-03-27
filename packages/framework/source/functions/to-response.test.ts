import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toJSON } from "./to-json.js";
import { toResponseReadable } from "./to-response-readable.js";
import { toResponse } from "./to-response.js";
import { toText } from "./to-text.js";

describe("toResponse(readable)", function () {
  context("when readable is a valid message stream", function () {
    it("should return message", async function () {
      let rawContent = "HTTP/1.1 200 Test\r\n";
      for (let i = 0; i < 818; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const readable = toBufferReadable(rawContent);
      const response = await toResponse(readable);
      const { headers, body } = response;
      expect(headers).to.be.instanceOf(Map);
      expect(isReadable(body)).to.be.true;

      const { protocol, statusCode, statusText } = response;
      expect(protocol).to.equal("HTTP/1.1");
      expect(statusCode).to.equal("200");
      expect(statusText).to.equal("Test");

      const data = await toJSON(body);
      expect(data).to.deep.equal({ test: true });
    });
  });
  context("when readable is not a valid message stream #1", function () {
    it("should return message", async function () {
      let rawContent = "HTTP/1.1 200 Test\r\n";
      for (let i = 0; i < 820; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      try {
        const readable = toBufferReadable(rawContent);
        await toResponse(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
  context("when readable is not a valid message stream #2", function () {
    it("should return message", async function () {
      let rawContent = "";
      for (let i = 0; i < 5; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      try {
        const readable = toBufferReadable(rawContent);
        await toResponse(readable);
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
        read() {
          this.destroy(new Error("test error"));
        },
      });

      try {
        const readable = toResponseReadable({ body, headers });
        const { body: content } = await toResponse(readable);
        await toText(content);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
