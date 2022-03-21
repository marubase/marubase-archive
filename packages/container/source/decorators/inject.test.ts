import { expect } from "chai";
import { getInjections } from "../functions/get-injections.js";
import { inject } from "./inject.js";
import { injectable } from "./injectable.js";

describe("@inject(registryKey)", function () {
  it("should set injection", async function () {
    @injectable()
    class Tester {
      public constructor(@inject(Date) public date: Date) {}

      @injectable()
      public test(@inject(Date) date: Date): Date {
        return date;
      }
    }

    const classInjections = getInjections(Tester);
    expect(classInjections).to.deep.equal([Date]);

    const methodInjections = getInjections(Tester.prototype, "test");
    expect(methodInjections).to.deep.equal([Date]);
  });
});
