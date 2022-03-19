import { expect } from "chai";
import { Cache } from "./cache.js";
import { Scope } from "./scope.js";

describe("Scope", function () {
  let scope: Scope;
  beforeEach(async function () {
    scope = new Scope();
  });

  describe("get container", function () {
    it("should return cache", async function () {
      const returnCache = scope.container;
      expect(returnCache).to.be.an.instanceOf(Cache);
    });
  });

  describe("get request", function () {
    it("should return cache", async function () {
      const returnCache = scope.request;
      expect(returnCache).to.be.an.instanceOf(Cache);
    });
  });

  describe("get singleton", function () {
    it("should return cache", async function () {
      const returnCache = scope.singleton;
      expect(returnCache).to.be.an.instanceOf(Cache);
    });
  });

  describe("#fork(type)", function () {
    context("when type argument is 'container'", function () {
      it("should return fork", async function () {
        const returnFork = scope.fork("container");
        expect(returnFork).to.be.an.instanceOf(Scope);
      });
    });
    context("when type argument is 'request'", function () {
      it("should return fork", async function () {
        const returnFork = scope.fork("request");
        expect(returnFork).to.be.an.instanceOf(Scope);
      });
    });
  });
});
