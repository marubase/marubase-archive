import { expect } from "chai";
import { Readable } from "stream";
import { toResponse } from "./to-response.js";

describe("toResponse(readable)", function () {
  context("when response readable have single header", function () {
    it("should return response", async function () {
      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;

      const readable = new Readable();
      readable.push(rawResponse, "utf8");
      readable.push(null);

      const { body, headers, protocol, statusCode, statusText } = await toResponse(readable);
      expect(protocol).to.equal("HTTP/1.1");
      expect(statusCode).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(Array.from(headers)).to.deep.equal([["Content-Type", "text/plain"]]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when response readable have multiple header", function () {
    it("should return response", async function () {
      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `Content-Length: 12\r\n`;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;

      const readable = new Readable();
      readable.push(rawResponse, "utf8");
      readable.push(null);

      const { body, headers, protocol, statusCode, statusText } = await toResponse(readable);
      expect(protocol).to.equal("HTTP/1.1");
      expect(statusCode).to.equal(200);
      expect(statusText).to.equal("OK");
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
  context("when response readable have no header", function () {
    it("should return response", async function () {
      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;

      const readable = new Readable();
      readable.push(rawResponse, "utf8");
      readable.push(null);

      const { body, headers, protocol, statusCode, statusText } = await toResponse(readable);
      expect(protocol).to.equal("HTTP/1.1");
      expect(statusCode).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(Array.from(headers)).to.deep.equal([]);

      const bodyChunks: Buffer[] = [];
      for await (const bodyChunk of body) bodyChunks.push(bodyChunk);

      const bodyBuffer = Buffer.concat(bodyChunks);
      const bodyText = bodyBuffer.toString("utf8");
      expect(bodyText).to.equal("hello, world");
    });
  });
  context("when response readable have no response line", function () {
    it("should return response", async function () {
      let rawResponse = ``;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;
      rawResponse += `hello, world`;

      const readable = new Readable();
      readable.push(rawResponse, "utf8");
      readable.push(null);

      try {
        await toResponse(readable);

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
  context("when response readable have no header in the first few bytes", function () {
    it("should throw error", async function () {
      let index = 0;
      const readable = new Readable({
        read() {
          this.push(`chunk-${index++}\r\n`);
        },
      });

      try {
        await toResponse(readable);

        throw new Error("it should never happen");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
      }
    });
  });
  context("when response readable throw error", function () {
    it("should throw error", async function () {
      let rawResponse = `HTTP/1.1 200 OK\r\n`;
      rawResponse += `Content-Length: 12\r\n`;
      rawResponse += `Content-Type: text/plain\r\n`;
      rawResponse += `\r\n`;

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
      readable.push(rawResponse);

      try {
        const { body, headers, protocol, statusCode, statusText } = await toResponse(readable);
        expect(protocol).to.equal("HTTP/1.1");
        expect(statusCode).to.equal(200);
        expect(statusText).to.equal("OK");
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
