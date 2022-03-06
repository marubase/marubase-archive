import { expect } from "chai";
import { IteratorStream } from "./iterator-stream.js";

describe("IteratorStream", function () {
  context("when input is array", function () {
    it("should return readable stream", async function () {
      const input = [0, 1, 2];
      const readable = new IteratorStream(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is async iterable", function () {
    it("should return readable stream", async function () {
      const input = async function* (): AsyncIterableIterator<number> {
        yield Promise.resolve(0);
        yield Promise.resolve(1);
        yield Promise.resolve(2);
      };

      const readable = new IteratorStream(input(), {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is iterable", function () {
    it("should return readable stream", async function () {
      const input = function* (): IterableIterator<number> {
        yield 0;
        yield 1;
        yield 2;
      };

      const readable = new IteratorStream(input(), {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
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

      const readable = new IteratorStream(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
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

      const readable = new IteratorStream(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items).to.deep.equal([0, 1, 2]);
    });
  });
});
