import { expect } from "chai";
import { toBufferReadable } from "./to-buffer-readable.js";
import { toJSON } from "./to-json.js";

describe("toJSON(readable)", function () {
  it("should return JsonData", async function () {
    const readable = toBufferReadable(`{"test":true}`);

    const data = await toJSON(readable);
    expect(data).to.deep.equal({ test: true });
  });
});
