import { expect } from "chai";
import { Readable } from "stream";
import { toRequest } from "./to-request.js";

describe("toRequest(readable)", function () {
  context("when request readable have single header", function () {
    it("should return request", async function () {
      let rawRequest = `GET /test HTTP/1.1\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      const { body, headers, method, protocol, url } = await toRequest(readable);
      expect(method).to.equal("GET");
      expect(protocol).to.equal("HTTP/1.1");
      expect(url.toString()).to.equal("http://127.0.0.1/test");
      expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when request readable have multiple header", function () {
    it("should return request", async function () {
      let rawRequest = `GET /test HTTP/1.1\r\n`;
      rawRequest += `Content-Length: 12\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      const { body, headers, method, protocol, url } = await toRequest(readable);
      expect(method).to.equal("GET");
      expect(protocol).to.equal("HTTP/1.1");
      expect(url.toString()).to.equal("http://127.0.0.1/test");
      expect(Array.from(headers)).to.deep.equal([
        ["Content-Length", "12"],
        ["Content-Type", "text/plain"],
      ]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when request readable have no header", function () {
    it("should return request", async function () {
      let rawRequest = `GET /test HTTP/1.1\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      const { body, headers, method, protocol, url } = await toRequest(readable);
      expect(method).to.equal("GET");
      expect(protocol).to.equal("HTTP/1.1");
      expect(url.toString()).to.equal("http://127.0.0.1/test");
      expect(Array.from(headers)).to.deep.equal([]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when request readable have 'Host' header", function () {
    it("should return request", async function () {
      let rawRequest = `GET /test HTTP/1.1\r\n`;
      rawRequest += `Host: example.com\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      const { body, headers, method, protocol, url } = await toRequest(readable);
      expect(method).to.equal("GET");
      expect(protocol).to.equal("HTTP/1.1");
      expect(url.toString()).to.equal("http://example.com/test");
      expect(Array.from(headers)).to.deep.equal([
        ["Host", "example.com"],
        ["Content-Type", "text/plain"],
      ]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when request readable have query parameters", function () {
    it("should return request", async function () {
      let rawRequest = `GET /test?test=true HTTP/1.1\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      const { body, headers, method, protocol, url } = await toRequest(readable);
      expect(method).to.equal("GET");
      expect(protocol).to.equal("HTTP/1.1");
      expect(url.toString()).to.equal("http://127.0.0.1/test?test=true");
      expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when request readable have no request line", function () {
    it("should throw error", async function () {
      let rawRequest = ``;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;
      rawRequest += `hello, world`;

      const readable = new Readable();
      readable.push(rawRequest, "utf8");
      readable.push(null);

      try {
        await toRequest(readable);

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
  context("when request readable have no header in the first few bytes", function () {
    it("should throw error", async function () {
      let index = 0;
      const readable = new Readable({
        read() {
          this.push(`chunk-${index++}\r\n`);
        },
      });

      try {
        await toRequest(readable);

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
  context("when request readable throw error", function () {
    it("should throw error", async function () {
      let rawRequest = `GET /test HTTP/1.1\r\n`;
      rawRequest += `Content-Length: 12\r\n`;
      rawRequest += `Content-Type: text/plain\r\n`;
      rawRequest += `\r\n`;

      let index = 0;
      const readable = new Readable({
        read() {
          if (index < 1000) this.push(`chunk-${index++}\r\n`);
          else {
            const error = new Error("test error");
            this.destroy(error);
          }
        },
      });
      readable.push(rawRequest);

      try {
        const { body, headers } = await toRequest(readable);
        expect(Array.from(headers)).to.deep.equal([
          ["Content-Length", "12"],
          ["Content-Type", "text/plain"],
        ]);

        const bodyChunks: Buffer[] = [];
        for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
});
