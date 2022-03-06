import { expect } from "chai";
import { toJSON } from "./to-json.js";
import { toReadable } from "./to-readable.js";

describe("toJson(stream)", function () {
  it("should return text", async function () {
    const readable = toReadable('{"test":true}');
    const data = await toJSON(readable);
    expect(data).to.deep.equal({ test: true });
  });
});
