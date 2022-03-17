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
      expect(scope.container).to.be.an.instanceOf(Cache);
    });
  });

  describe("get request", function () {
    it("should return cache", async function () {
      expect(scope.request).to.be.an.instanceOf(Cache);
    });
  });

  describe("get singleton", function () {
    it("should return cache", async function () {
      expect(scope.singleton).to.be.an.instanceOf(Cache);
    });
  });

  describe("#fork(type)", function () {
    context("when type is 'container'", function () {
      it("should return fork", async function () {
        const fork = scope.fork("container");
        expect(fork).to.be.an.instanceOf(Scope);
      });
    });
    context("when type is 'request'", function () {
      it("should return fork", async function () {
        const fork = scope.fork("request");
        expect(fork).to.be.an.instanceOf(Scope);
      });
    });
  });
});
