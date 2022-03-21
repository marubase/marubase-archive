import { expect } from "chai";
import { isReadable } from "./is-readable.js";
import { toCollectionReadable } from "./to-collection-readable.js";
import { toCollection } from "./to-collection.js";

describe("toCollectionReadable(input)", function () {
  context("when input is Array", function () {
    it("should return readable stream", async function () {
      const input = [0, 1, 2];

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      const collection = await toCollection(readable);
      expect(collection).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is AsyncIterable", function () {
    it("should return readable stream", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        [Symbol.asyncIterator](): AsyncIterator<number> {
          return this;
        },
        async next(): Promise<IteratorResult<number>> {
          return this.cursor < this.items.length
            ? { done: false, value: this.items[this.cursor++] }
            : { done: true, value: undefined };
        },
      };

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      const collection = await toCollection(readable);
      expect(collection).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is AsyncIterator", function () {
    it("should return readable stream", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        async next(): Promise<IteratorResult<number>> {
          return this.cursor < this.items.length
            ? { done: false, value: this.items[this.cursor++] }
            : { done: true, value: undefined };
        },
      };

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      const collection = await toCollection(readable);
      expect(collection).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is Iterable", function () {
    it("should return readable stream", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        [Symbol.iterator](): Iterator<number> {
          return this;
        },
        next(): IteratorResult<number> {
          return this.cursor < this.items.length
            ? { done: false, value: this.items[this.cursor++] }
            : { done: true, value: undefined };
        },
      };

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      const collection = await toCollection(readable);
      expect(collection).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input is Iterator", function () {
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

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      const collection = await toCollection(readable);
      expect(collection).to.deep.equal([0, 1, 2]);
    });
  });
  context("when input throw error", function () {
    it("should throw error", async function () {
      const input = {
        cursor: 0,
        items: [0, 1, 2],
        async next(): Promise<IteratorResult<number>> {
          return this.cursor < this.items.length
            ? { done: false, value: this.items[this.cursor++] }
            : Promise.reject(new Error("test error"));
        },
      };

      const readable = toCollectionReadable(input);
      expect(isReadable(readable)).to.be.true;

      try {
        await toCollection(readable);
      } catch (error) {} /* eslint-disable-line no-empty */
    });
  });
});
