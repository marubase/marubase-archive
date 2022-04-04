import { expect } from "chai";
import { Readable } from "stream";
import { toRequestReadable } from "./to-request-readable.js";

describe("toRequestReadable(request, options", function () {
  context("when request have single header", function () {
    it("should return request readable", async function () {
      const protocol = "HTTP/1.1";
      const method = "GET";
      const url = new URL("http://127.0.0.1/test?query=true");
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const request = { body, headers, method, protocol, url };
      const requestChunks: Buffer[] = [];
      for await (const requestChunk of toRequestReadable(request)) {
        requestChunks.push(requestChunk);
      }

      const requestBuffer = Buffer.concat(requestChunks);
      const requestText = requestBuffer.toString("utf8");

      let rawRequest = `GET /test?query=true HTTP/1.1\r\n`;
      rawRequest += `Host: 127.0.0.1\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;
      expect(requestText).to.equal(rawRequest);
    });
  });
  context("when request have multiple header", function () {
    it("should return request readable", async function () {
      const protocol = "HTTP/1.1";
      const method = "GET";
      const url = new URL("http://127.0.0.1/test?query=true");
      const headers = new Map([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const request = { body, headers, method, protocol, url };
      const requestChunks: Buffer[] = [];
      for await (const requestChunk of toRequestReadable(request)) {
        requestChunks.push(requestChunk);
      }

      const requestBuffer = Buffer.concat(requestChunks);
      const requestText = requestBuffer.toString("utf8");

      let rawRequest = `GET /test?query=true HTTP/1.1\r\n`;
      rawRequest += `Host: 127.0.0.1\r\n`;
      rawRequest += `Content-Length: 12\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;
      expect(requestText).to.equal(rawRequest);
    });
  });
  context("when request have no header", function () {
    it("should return request readable", async function () {
      const protocol = "HTTP/1.1";
      const method = "GET";
      const url = new URL("http://127.0.0.1/test?query=true");
      const headers = new Map<string, string>();
      const body = new Readable();
      body.push("hello, world", "utf8");
      body.push(null);

      const request = { body, headers, method, protocol, url };
      const requestChunks: Buffer[] = [];
      for await (const requestChunk of toRequestReadable(request)) {
        requestChunks.push(requestChunk);
      }

      const requestBuffer = Buffer.concat(requestChunks);
      const requestText = requestBuffer.toString("utf8");

      let rawRequest = `GET /test?query=true HTTP/1.1\r\n`;
      rawRequest += `Host: 127.0.0.1\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;
      expect(requestText).to.equal(rawRequest);
    });
  });
  context("when request body throw error", function () {
    it("should throw error", async function () {
      const protocol = "HTTP/1.1";
      const method = "GET";
      const url = new URL("http://127.0.0.1/test?query=true");
      const headers = new Map([["Content-Type", "text/plain"]]);
      const body = new Readable({
        read() {
          const error = new Error("test error");
          this.destroy(error);
        },
      });

      try {
        const request = { body, headers, method, protocol, url };
        const requestChunks: Buffer[] = [];
        for await (const requestChunk of toRequestReadable(request)) {
          requestChunks.push(requestChunk);
        }

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
