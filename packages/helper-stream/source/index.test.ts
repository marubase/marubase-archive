import { expect } from "chai";
import tester from "./index.js";

describe("Test", function () {
  it("should run", async function () {
    expect(tester.test).to.be.true;
  });
});
