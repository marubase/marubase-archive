import { expect } from "chai";
import { getScope } from "../functions/get-scope.js";
import { injectable } from "./injectable.js";
import { scope } from "./scope.js";

describe("@inject(registryKey)", function () {
  it("should set injection", async function () {
    @injectable()
    @scope("container")
    class Tester {
      @injectable()
      @scope("container")
      public test(): void {
        return;
      }
    }

    const classScope = getScope(Tester);
    expect(classScope).to.equal("container");

    const methodScope = getScope(Tester.prototype, "test");
    expect(methodScope).to.equal("container");
  });
});
