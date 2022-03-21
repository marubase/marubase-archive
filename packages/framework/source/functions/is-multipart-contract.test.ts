import { expect } from "chai";
import { MessageContract } from "../contracts/message.contract.js";
import { MultipartContract } from "../contracts/multipart.contract.js";
import { isMultipartContract } from "./is-multipart-contract.js";
import { toBufferReadable } from "./to-buffer-readable.js";

describe("isMultipartContract(input)", function () {
  context("when input is multipart contract", function () {
    it("should return true", async function () {
      const input: MultipartContract = {
        boundary: "boundary",
        contentType: "content-type",
        mimeType: "mime-type",
        [Symbol.asyncIterator](): AsyncIterator<MessageContract> {
          return {
            next(): Promise<IteratorResult<MessageContract>> {
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
        setBoundary(boundary) {
          return this;
        },
        setContentType(contentType) {
          return this;
        },
        setMimeType(mimeType) {
          return this;
        },
        toStream() {
          return toBufferReadable("");
        },
      };
      expect(isMultipartContract(input)).to.be.true;
    });
  });
  context("when input is not multipart contract", function () {
    it("should return false", async function () {
      const input = null;
      expect(isMultipartContract(input)).to.be.false;
    });
  });
});
