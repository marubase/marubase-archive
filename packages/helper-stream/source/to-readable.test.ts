import { expect } from "chai";
import { toReadable } from "./to-readable.js";

describe("toReadable(input)", function () {
  context("when input is array buffer", function () {
    it("should return readable stream", async function () {
      const input = Buffer.from([65, 66, 67]);

      let buffer = "";
      for await (const chunk of toReadable(input).setEncoding("utf8"))
        buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
  context("when input is typed array", function () {
    it("should return readable stream", async function () {
      const input = Buffer.from([65, 66, 67]);

      let buffer = "";
      for await (const chunk of toReadable(input).setEncoding("utf8"))
        buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
  context("when input is string", function () {
    it("should return readable stream", async function () {
      const input = "ABC";

      let buffer = "";
      for await (const chunk of toReadable(input).setEncoding("utf8"))
        buffer += chunk;
      expect(buffer).to.equal("ABC");
    });
  });
  context("when input is array", function () {
    it("should return readable stream", async function () {
      const input = [0, 1, 2];

      const items: number[] = [];
      for await (const item of toReadable(input)) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is async iterable", function () {
    it("should return readable stream", async function () {
      const iterate = async function* (): AsyncIterableIterator<number> {
        yield Promise.resolve(0);
        yield Promise.resolve(1);
        yield Promise.resolve(2);
      };

      const items: number[] = [];
      for await (const item of toReadable(iterate())) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is iterable", function () {
    it("should return readable stream", async function () {
      const iterate = function* (): IterableIterator<number> {
        yield 0;
        yield 1;
        yield 2;
      };

      const items: number[] = [];
      for await (const item of toReadable(iterate())) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is async iterator", function () {
    it("should return readable stream", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        async next(): Promise<IteratorResult<number>> {
          return this.cursor < this.items.length
            ? Promise.resolve({ done: false, value: this.items[this.cursor++] })
            : Promise.resolve({ done: true, value: undefined });
        },
      };

      const items: number[] = [];
      for await (const item of toReadable(input)) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is iterator", function () {
    it("should return readable stream", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        next(): IteratorResult<number> {
          return this.cursor < this.items.length
            ? { done: false, value: this.items[this.cursor++] }
            : { done: true, value: undefined };
        },
      };

      const items: number[] = [];
      for await (const item of toReadable(input)) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is not buffer or array", function () {
    it("should throw error", async function () {
      const input = {};
      const process = (): unknown => toReadable(input);
      expect(process).to.throw(TypeError);
    });
  });
});
