import { expect } from "chai";
import { Cache } from "./cache.js";

describe("Cache", function () {
  let cache: Cache;
  beforeEach(async function () {
    cache = new Cache();
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const returnFork = cache.fork();
      expect(returnFork).to.be.an.instanceOf(Cache);
    });
  });
});
