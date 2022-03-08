import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toJsonData } from "./to-json-data.js";

describe("toJsonData(readable)", function () {
  it("should return JsonData", async function () {
    const readable = toBufferReadable(`{"test":true}`);

    const data = await toJsonData(readable);
    expect(data).to.deep.equal({ test: true });
  });
});
