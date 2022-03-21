import { expect } from "chai";
import { isInjectable } from "../functions/is-injectable.js";
import { injectable } from "./injectable.js";

describe("@injectable()", function () {
  it("should set injectable", async function () {
    @injectable()
    class Tester {
      @injectable()
      public test(): void {
        return;
      }
    }

    const classInjectable = isInjectable(Tester);
    expect(classInjectable).to.be.true;

    const methodInjectable = isInjectable(Tester.prototype, "test");
    expect(methodInjectable).to.be.true;
  });
});
