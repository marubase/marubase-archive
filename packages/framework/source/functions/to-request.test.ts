import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toJSON } from "./to-json.js";
import { toRequestReadable } from "./to-request-readable.js";
import { toRequest } from "./to-request.js";
import { toText } from "./to-text.js";

describe("toRequest(readable)", function () {
  context("when readable is a valid message stream", function () {
    it("should return message", async function () {
      let rawContent = "GET /test HTTP/1.1\r\n";
      for (let i = 0; i < 818; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const readable = toBufferReadable(rawContent);
      const request = await toRequest(readable);
      const { headers, body } = request;
      expect(headers).to.be.instanceOf(Map);
      expect(isReadable(body)).to.be.true;

      const { method, path, protocol } = request;
      expect(method).to.equal("GET");
      expect(path).to.equal("/test");
      expect(protocol).to.equal("HTTP/1.1");

      const data = await toJSON(body);
      expect(data).to.deep.equal({ test: true });
    });
  });
  context("when readable is not a valid message stream #1", function () {
    it("should return message", async function () {
      let rawContent = "GET /test HTTP/1.1\r\n";
      for (let i = 0; i < 820; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      try {
        const readable = toBufferReadable(rawContent);
        await toRequest(readable);
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
        await toRequest(readable);
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
        const readable = toRequestReadable({ body, headers });
        const { body: content } = await toRequest(readable);
        await toText(content);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
