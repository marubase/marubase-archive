import { expect } from "chai";
import { Readable } from "stream";
import { toResponseReadable } from "./to-response-readable.js";

describe("toResponseReadable(response, options)", function () {
  context("when response have single header", function () {
    it("should return response readable", async function () {
      const protocol = "HTTP/1.1";
      const statusCode = 200;
      const statusText = "OK";
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const response = { body, headers, protocol, statusCode, statusText };
      const responseChunks: Buffer[] = [];
      for await (const responseChunk of toResponseReadable(response)) {
        responseChunks.push(responseChunk);
      }

      const responseBuffer = Buffer.concat(responseChunks);
      const responseText = responseBuffer.toString("utf8");

      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;
      expect(responseText).to.equal(rawResponse);
    });
  });
  context("when response have multiple header", function () {
    it("should return response readable", async function () {
      const protocol = "HTTP/1.1";
      const statusCode = 200;
      const statusText = "OK";
      const headers = new Map([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const response = { body, headers, protocol, statusCode, statusText };
      const responseChunks: Buffer[] = [];
      for await (const responseChunk of toResponseReadable(response)) {
        responseChunks.push(responseChunk);
      }

      const responseBuffer = Buffer.concat(responseChunks);
      const responseText = responseBuffer.toString("utf8");

      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `Content-Length: 12\r\n`;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;
      expect(responseText).to.equal(rawResponse);
    });
  });
  context("when response have no header", function () {
    it("should return response readable", async function () {
      const protocol = "HTTP/1.1";
      const statusCode = 200;
      const statusText = "OK";
      const headers = new Map<string, string>();
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const response = { body, headers, protocol, statusCode, statusText };
      const responseChunks: Buffer[] = [];
      for await (const responseChunk of toResponseReadable(response)) {
        responseChunks.push(responseChunk);
      }

      const responseBuffer = Buffer.concat(responseChunks);
      const responseText = responseBuffer.toString("utf8");

      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;
      expect(responseText).to.equal(rawResponse);
    });
  });
  context("when response body throw error", function () {
    it("should throw error", async function () {
      const protocol = "HTTP/1.1";
      const statusCode = 200;
      const statusText = "OK";
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable({
        read() {
          const error = new Error("test error");
          this.destroy(error);
        },
      });

      try {
        const response = { body, headers, protocol, statusCode, statusText };
        const responseChunks: Buffer[] = [];
        for await (const responseChunk of toResponseReadable(response)) {
          responseChunks.push(responseChunk);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
