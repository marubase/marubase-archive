import { expect } from "chai";
import { Readable } from "stream";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toBuffer } from "./to-buffer.js";
import { toMultipartReadable } from "./to-multipart-readable.js";
import { toMultipart } from "./to-multipart.js";
import { toTextData } from "./to-text-data.js";

describe("toMultipart(boundary, readable)", function () {
  context("when readable is a valid multipart", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      let rawContent = "";
      for (let i = 0; i < 3; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const parts: Readable[] = [
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
      ];

      const readable = toMultipartReadable({ boundary, parts });
      for await (const part of toMultipart(boundary, readable)) {
        const content = await toTextData(part);
        expect(content).to.equal(rawContent);
      }
    });
  });
  context("when readable is sent in huge chunk", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      let rawContent = "";
      for (let i = 0; i < 3; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const parts: Readable[] = [
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
      ];

      const multipartReadable = toMultipartReadable({ boundary, parts });
      const readable = toBufferReadable(await toBuffer(multipartReadable));
      for await (const part of toMultipart(boundary, readable)) {
        const content = await toTextData(part);
        expect(content).to.equal(rawContent);
      }
    });
  });
  context("when there is preamble and epilogue", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      let rawContent = "";
      for (let i = 0; i < 800; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const preamble = Buffer.alloc(16384, "preamble");
      const epilogue = Buffer.alloc(16384, "epilogue");

      const parts: Readable[] = [
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
      ];

      const multipartReadable = toMultipartReadable({ boundary, parts });

      let reader: AsyncIterator<Buffer>;
      const readable = new Readable({
        read() {
          if (typeof reader !== "undefined") {
            reader.next().then((chunk) => {
              if (!chunk.done) return this.push(chunk.value);
              else this.push(epilogue), this.push("\r\n"), this.push(null);
            });
          } else {
            reader = multipartReadable[Symbol.asyncIterator]();
            this.push(preamble), this.push("\r\n");
          }
        },
      });

      for await (const part of toMultipart(boundary, readable)) {
        const content = await toTextData(part);
        expect(content).to.equal(rawContent);
      }
    });
  });
  context("when readable is not a valid multipart #1", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      const readable = toBufferReadable(Buffer.from(`--${boundary}a`));
      for await (const part of toMultipart(boundary, readable)) {
        await toTextData(part);
      }
    });
  });
  context("when readable is not a valid multipart #2", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      const readable = toBufferReadable(Buffer.from(`--${boundary}aa`));
      for await (const part of toMultipart(boundary, readable)) {
        await toTextData(part);
      }
    });
  });
  context("when readable is not a valid multipart #3", function () {
    it("should return async iterable", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      let rawContent = "";
      for (let i = 0; i < 3; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const parts: Readable[] = [
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
      ];

      const multipartReadable = toMultipartReadable({ boundary, parts });
      const buffer = await toBuffer(multipartReadable);
      const readable = toBufferReadable(buffer.subarray(0, -2));
      try {
        for await (const part of toMultipart(boundary, readable)) await toTextData(part);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
  context("when readable throw error", function () {
    it("should throw error", async function () {
      const boundary =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);

      let rawContent = "";
      for (let i = 0; i < 3; i++) {
        const index = i.toString(10).padStart(5);
        rawContent += `Test-Header: ${index}\r\n`;
      }
      rawContent += `\r\n`;
      rawContent += `{"test":true}`;

      const parts: Readable[] = [
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
        toBufferReadable(rawContent),
      ];

      const multipartReadable = toMultipartReadable({ boundary, parts });
      const buffer = (await toBuffer(multipartReadable)).subarray(0, -2);
      const reader = toBufferReadable(buffer)[Symbol.asyncIterator]();
      const readable = new Readable({
        read() {
          reader.next().then((chunk) => {
            if (!chunk.done) this.push(chunk.value);
            else this.destroy(new Error("test error"));
          });
        },
      });
      try {
        for await (const part of toMultipart(boundary, readable)) await toTextData(part);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
