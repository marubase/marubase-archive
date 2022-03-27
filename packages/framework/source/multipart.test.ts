import { expect } from "chai";
import { MessageContract } from "./contracts/message.contract.js";
import { FrameworkError } from "./errors/framework.error.js";
import { isReadable } from "./functions/is-readable.js";
import { Message } from "./message.js";
import { Multipart } from "./multipart.js";

describe("Multipart", function () {
  describe("get boundary", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    it("should return boundary", async function () {
      const returnBoundary = multipart.boundary;
      expect(returnBoundary).to.be.a("string");
    });
  });

  describe("get contentType", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    it("should return content type", async function () {
      const returnContentType = multipart.contentType;
      expect(returnContentType).to.match(/^(multipart\/.+);\s*boundary="(.+)"$/);
    });
  });

  describe("get mimeType", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    it("should return mime type", async function () {
      const returnMimeType = multipart.mimeType;
      expect(returnMimeType).to.match(/^multipart\/.+/);
    });
  });

  describe("#[Symbol.asyncIterator]()", function () {
    context("when multipart body is stream", function () {
      let multipart: Multipart;
      beforeEach(async function () {
        const argMessage = new Message().setBody({ test: true });
        const argMultipart = new Multipart(argMessage);
        const argStream = argMultipart.toStream();
        multipart = new Multipart(argStream).setBoundary(argMultipart.boundary);
      });
      it("should iterator", async function () {
        const parts: MessageContract[] = [];
        for await (const part of multipart) parts.push(part);
        expect(parts).to.have.lengthOf(1);
      });
    });
    context("when multipart body is message", function () {
      let multipart: Multipart;
      beforeEach(async function () {
        const argMessage = new Message().setBody({ test: true });
        multipart = new Multipart(argMessage);
      });
      it("should iterator", async function () {
        const parts: MessageContract[] = [];
        for await (const part of multipart) parts.push(part);
        expect(parts).to.have.lengthOf(1);
      });
    });
  });

  describe("#setBoundary(boundary)", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    it("should return self", async function () {
      const returnSelf = multipart.setBoundary("boundary");
      expect(returnSelf).to.equal(multipart);
    });
  });

  describe("#setContentType(contentType)", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    context("when content type does match content type pattern", function () {
      it("should return self", async function () {
        const contentType = `multipart/mixed; boundary="boundary"`;
        const returnSelf = multipart.setContentType(contentType);
        expect(returnSelf).to.equal(multipart);
      });
    });
    context("when content type does not match content type pattern", function () {
      it("should throw error", async function () {
        const run = (): unknown => multipart.setContentType("content-type");
        expect(run).to.throw(FrameworkError);
      });
    });
  });

  describe("#setMimeType(mimeType)", function () {
    let multipart: Multipart;
    beforeEach(async function () {
      const argMessage = new Message().setBody({ test: true });
      multipart = new Multipart(argMessage);
    });
    context("when mimeType does match mime type pattern", function () {
      it("should return self", async function () {
        const mimeType = `multipart/mixed`;
        const returnSelf = multipart.setMimeType(mimeType);
        expect(returnSelf).to.equal(multipart);
      });
    });
    context("when mimeType does not match mime type pattern", function () {
      it("should throw error", async function () {
        const run = (): unknown => multipart.setMimeType("mime-type");
        expect(run).to.throw(FrameworkError);
      });
    });
  });

  describe("#toStream()", function () {
    context("when multipart body is stream", function () {
      let multipart: Multipart;
      beforeEach(async function () {
        const argMessage = new Message().setBody({ test: true });
        const argMultipart = new Multipart(argMessage);
        const argStream = argMultipart.toStream();
        multipart = new Multipart(argStream);
      });
      it("should return stream", async function () {
        const returnStream = multipart.toStream();
        expect(isReadable(returnStream)).to.be.true;
      });
    });
    context("when multipart body is message", function () {
      let multipart: Multipart;
      beforeEach(async function () {
        const argMessage = new Message().setBody({ test: true });
        multipart = new Multipart(argMessage);
      });
      it("should return stream", async function () {
        const returnStream = multipart.toStream();
        expect(isReadable(returnStream)).to.be.true;
      });
    });
  });
});
