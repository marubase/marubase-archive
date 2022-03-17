import { expect } from "chai";
import { Cache } from "./cache.js";

describe("Cache", function () {
  let cache: Cache;
  beforeEach(async function () {
    cache = new Cache();
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const fork = cache.fork();
      expect(fork).to.be.an.instanceOf(Cache);
    });
  });
});
