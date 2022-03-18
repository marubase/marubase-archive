import { expect } from "chai";
import { isInjectable } from "../functions/is-injectable.js";
import { injectable } from "./injectable.js";

describe("@injectable()", function () {
  context("when injectable decorating constructor", function () {
    it("should make class injectable", async function () {
      @injectable()
      class Tester {}

      const actualIsInjectable = isInjectable(Tester);
      expect(actualIsInjectable).to.be.true;
    });
  });
  context("when injectable decorating method", function () {
    it("should make method injectable", async function () {
      class Tester {
        @injectable()
        public test(): void {
          return;
        }
      }

      const actualIsInjectable = isInjectable(Tester.prototype, "test");
      expect(actualIsInjectable).to.be.true;
    });
  });
});
