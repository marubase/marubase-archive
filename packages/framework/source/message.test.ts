import { expect } from "chai";
import { Readable } from "stream";
import { MessageContract } from "./contracts/message.contract.js";
import { FrameworkError } from "./errors/framework.error.js";
import { isReadable } from "./functions/is-readable.js";
import { toBufferReadable } from "./functions/to-buffer-readable.js";
import { toBuffer } from "./functions/to-buffer.js";
import { Message } from "./message.js";
import { Multipart } from "./multipart.js";

describe("Message", function () {
  let message: MessageContract;
  beforeEach(async function () {
    message = new Message();
  });

  describe("static from(readable)", function () {
    it("should return message", async function () {
      const source = new Message().setBody({ test: true });
      const stream = source.toStream();

      const message = await Message.from(stream);
      expect(message).to.be.an.instanceOf(Message);
    });
  });

  describe("get body", function () {
    context("when body is buffer", function () {
      beforeEach(async function () {
        const argBody = Buffer.from("test", "utf8");
        message.setBody(argBody);
      });
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        message.setBody(argBody);
      });
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
    context("when body is stream", function () {
      beforeEach(async function () {
        const argBuffer = Buffer.from("test", "utf8");
        const argBody = toBufferReadable(argBuffer);
        message.setBody(argBody);
      });
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
    context("when body is attachment data", function () {
      beforeEach(async function () {
        const rawData = Buffer.from("test", "utf8");
        const argBody = {
          content_type: "application/octet-stream",
          data: rawData.toString("base64"),
          length: rawData.length,
        };
        message.setHeader("Content-Type", "application/octet-stream").setBody(argBody);
        message.clearHeader("Content-Type");
      });
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
    context("when body is json data", function () {
      beforeEach(async function () {
        const argBody = { message: "hello, world" };
        message.setHeader("Content-Type", "application/json").setBody(argBody);
      });
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
    context("when body is undefined", function () {
      it("should return stream", async function () {
        const returnBody = message.body;
        expect(returnBody).to.be.an.instanceOf(Readable);
      });
    });
  });

  describe("get headers", function () {
    context("when there is headers", function () {
      beforeEach(async function () {
        message.setHeaders([["Test", "true"]]);
      });
      it("should returns header map", async function () {
        const returnHeaders = message.headers;
        expect(returnHeaders).to.be.an.instanceOf(Map);
      });
    });
    context("when there is no headers", function () {
      it("should returns header map", async function () {
        const returnHeaders = message.headers;
        expect(returnHeaders).to.be.an.instanceOf(Map);
      });
    });
  });

  describe("get protocol", function () {
    it("should return protocol", async function () {
      const returnProtocol = message.protocol;
      expect(returnProtocol).to.equal("HTTP/1.1");
    });
  });

  describe("#clearBody()", function () {
    context("when body is buffer", function () {
      beforeEach(async function () {
        const argBody = Buffer.from("test", "utf8");
        message.setBody(argBody);
      });
      it("should return self", async function () {
        const returnSelf = message.clearBody();
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        message.setBody(argBody);
      });
      it("should return self", async function () {
        const returnSelf = message.clearBody();
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is stream", function () {
      beforeEach(async function () {
        const argBuffer = Buffer.from("test", "utf8");
        const argBody = toBufferReadable(argBuffer);
        message.setBody(argBody);
      });
      it("should return self", async function () {
        const returnSelf = message.clearBody();
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is data", function () {
      beforeEach(async function () {
        const argBody = { message: "hello, world" };
        message.setBody(argBody);
      });
      it("should return self", async function () {
        const returnSelf = message.clearBody();
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is undefined", function () {
      it("should return self", async function () {
        const returnSelf = message.clearBody();
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#clearHeader(key)", function () {
    context("when there is headers", function () {
      beforeEach(async function () {
        message.setHeaders([["Test", "true"]]);
      });
      it("should returns self", async function () {
        const returnSelf = message.clearHeader("Test");
        expect(returnSelf).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should returns self", async function () {
        const returnSelf = message.clearHeader("Test");
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#clearHeaders()", function () {
    context("when there is headers", function () {
      beforeEach(async function () {
        message.setHeaders([["Test", "true"]]);
      });
      it("should returns self", async function () {
        const returnSelf = message.clearHeaders();
        expect(returnSelf).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should returns self", async function () {
        const returnSelf = message.clearHeaders();
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#setBody(body)", function () {
    context("when body is buffer view and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-stream");
      });
      it("should return self", async function () {
        const argBody = Buffer.from("test", "utf8");
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is buffer view and there is no content type header", function () {
      it("should return self", async function () {
        const argBody = Buffer.from("test", "utf8");
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is array buffer and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-stream");
      });
      it("should return self", async function () {
        const argBody = new ArrayBuffer(8);
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is array buffer and there is no content type header", function () {
      it("should return self", async function () {
        const argBody = new ArrayBuffer(8);
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is string and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-stream");
      });
      it("should return self", async function () {
        const argBody = "hello, world";
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is string and there is no content type header", function () {
      it("should return self", async function () {
        const argBody = "hello, world";
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is multipart and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-stream");
      });
      it("should return self", async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is multipart and there is no content type header", function () {
      it("should return self", async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is stream and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-stream");
      });
      it("should return self", async function () {
        const argBody = toBufferReadable("hello, world");
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is stream and there is no content type header", function () {
      it("should return self", async function () {
        const argBody = toBufferReadable("hello, world");
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is data and there is content type header", function () {
      beforeEach(async function () {
        message.setHeader("Content-Type", "application/octet-data");
      });
      it("should return self", async function () {
        const argBody = { message: "hello, world" };
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when body is data and there is no content type header", function () {
      it("should return self", async function () {
        const argBody = { message: "hello, world" };
        const returnSelf = message.setBody(argBody);
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#setHeader(key, value)", function () {
    context("when there is headers", function () {
      beforeEach(async function () {
        message.setHeaders([["Test", "true"]]);
      });
      it("should returns self", async function () {
        const returnSelf = message.setHeader("Test", "true");
        expect(returnSelf).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should returns self", async function () {
        const returnSelf = message.setHeader("Test", "true");
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#setHeaders(headers)", function () {
    context("when there is headers", function () {
      beforeEach(async function () {
        message.setHeaders([["Test", "true"]]);
      });
      it("should returns self", async function () {
        const returnSelf = message.setHeaders([["Test", "true"]]);
        expect(returnSelf).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should returns self", async function () {
        const returnSelf = message.setHeaders([["Test", "true"]]);
        expect(returnSelf).to.equal(message);
      });
    });
  });

  describe("#setProtocol(protocol)", function () {
    it("should return self", async function () {
      const returnSelf = message.setProtocol("HTTP/2");
      expect(returnSelf).to.equal(message);
    });
  });

  describe("#toBuffer()", function () {
    context("when body is buffer", function () {
      beforeEach(async function () {
        const argBody = Buffer.from("test", "utf8");
        message.setBody(argBody);
      });
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        message.setBody(argBody);
      });
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when body is stream", function () {
      beforeEach(async function () {
        const argBuffer = Buffer.from("test", "utf8");
        const argBody = toBufferReadable(argBuffer);
        message.setBody(argBody);
      });
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when body is attachment data", function () {
      beforeEach(async function () {
        const rawData = Buffer.from("test", "utf8");
        const argBody = {
          content_type: "application/octet-stream",
          data: rawData.toString("base64"),
          length: rawData.length,
        };
        message.setHeader("Content-Type", "application/octet-stream").setBody(argBody);
        message.clearHeader("Content-Type");
      });
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when body is json data", function () {
      beforeEach(async function () {
        const argBody = { message: "hello, world" };
        message.setHeader("Content-Type", "application/json").setBody(argBody);
      });
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when body is undefined", function () {
      it("should return buffer", async function () {
        const returnBuffer = await message.toBuffer();
        expect(returnBuffer).to.be.an.instanceOf(Buffer);
      });
    });
  });

  describe("#toData()", function () {
    context("when body is attachment buffer", function () {
      beforeEach(async function () {
        const data = {
          content_type: "application/octet-stream",
          data: Buffer.from("test", "utf8"),
          length: 4,
        };
        const json = JSON.stringify(data);
        const buffer = Buffer.from(json, "utf8");
        message.setHeader("Content-Type", "application/octet-stream").setBody(buffer);
        message.clearHeader("Content-Type");
      });
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.an("object");
      });
    });
    context("when body is json buffer", function () {
      beforeEach(async function () {
        const data = { message: "hello, world" };
        const json = JSON.stringify(data);
        const buffer = Buffer.from(json, "utf8");
        message.setHeader("Content-Type", "application/json").setBody(buffer);
      });
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.an("object");
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        message.setBody(argBody);
      });
      it("should throw error", async function () {
        try {
          await message.toData();
        } catch (error) {
          expect(error).to.be.an.instanceOf(FrameworkError);
        }
      });
    });
    context("when body is attachment stream", function () {
      beforeEach(async function () {
        const data = {
          content_type: "application/octet-stream",
          data: Buffer.from("test", "utf8"),
          length: 4,
        };
        const json = JSON.stringify(data);
        const buffer = Buffer.from(json, "utf8");
        const stream = toBufferReadable(buffer);
        message.setHeader("Content-Type", "application/octet-stream").setBody(stream);
        message.clearHeader("Content-Type");
      });
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.an("object");
      });
    });
    context("when body is json stream", function () {
      beforeEach(async function () {
        const data = { message: "hello, world" };
        const json = JSON.stringify(data);
        const buffer = Buffer.from(json, "utf8");
        const stream = toBufferReadable(buffer);
        message.setHeader("Content-Type", "application/json").setBody(stream);
      });
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.an("object");
      });
    });
    context("when body is json data", function () {
      beforeEach(async function () {
        const data = { message: "hello, world" };
        message.setHeader("Content-Type", "application/json").setBody(data);
      });
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.an("object");
      });
    });
    context("when body is undefined", function () {
      it("should return data", async function () {
        const returnData = await message.toData();
        expect(returnData).to.be.null;
      });
    });
  });

  describe("#toMultipart()", function () {
    context("when body is buffer and is of multipart content", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const multipart = new Multipart(argPart);
        const argBody = await toBuffer(multipart.toStream());
        message.setHeader("Content-Type", multipart.contentType).setBody(argBody);
      });
      it("should return multipart", async function () {
        const returnMultipart = message.toMultipart();
        expect(returnMultipart).to.be.an.instanceOf(Multipart);
      });
    });
    context("when body is buffer and is not multipart content", function () {
      beforeEach(async function () {
        const argBody = Buffer.from("test", "utf8");
        message.setBody(argBody);
        message.clearHeader("Content-Type");
      });
      it("should throw error", async function () {
        const run = (): unknown => message.toMultipart();
        expect(run).to.throw(FrameworkError);
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const multipart = new Multipart(argPart);
        message.setBody(multipart);
      });
      it("should return multipart", async function () {
        const returnMultipart = message.toMultipart();
        expect(returnMultipart).to.be.an.instanceOf(Multipart);
      });
    });
    context("when body is stream and is of multipart content", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const multipart = new Multipart(argPart);
        const argBody = multipart.toStream();
        message.setHeader("Content-Type", multipart.contentType).setBody(argBody);
      });
      it("should return multipart", async function () {
        const returnMultipart = message.toMultipart();
        expect(returnMultipart).to.be.an.instanceOf(Multipart);
      });
    });
    context("when body is stream and is not multipart content", function () {
      beforeEach(async function () {
        const argBody = toBufferReadable(Buffer.from("test", "utf8"));
        message.setBody(argBody);
        message.clearHeader("Content-Type");
      });
      it("should throw error", async function () {
        const run = (): unknown => message.toMultipart();
        expect(run).to.throw(FrameworkError);
      });
    });
    context("when body is json data", function () {
      beforeEach(async function () {
        message.setBody({ ok: true });
      });
      it("should throw error", async function () {
        const run = (): unknown => message.toMultipart();
        expect(run).to.throw(FrameworkError);
      });
    });
    context("when body is undefined", function () {
      it("should throw error", async function () {
        const run = (): unknown => message.toMultipart();
        expect(run).to.throw(FrameworkError);
      });
    });
  });

  describe("#toStream()", function () {
    it("should return readable stream", async function () {
      const returnStream = message.toStream();
      expect(isReadable(returnStream)).to.be.true;
    });
  });

  describe("#toText()", function () {
    context("when body is buffer", function () {
      beforeEach(async function () {
        const argBody = Buffer.from("test", "utf8");
        message.setBody(argBody);
      });
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
    context("when body is multipart", function () {
      beforeEach(async function () {
        const argPart = new Message().setBody("argPart");
        const argBody = new Multipart(argPart);
        message.setBody(argBody);
      });
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
    context("when body is stream", function () {
      beforeEach(async function () {
        const argBuffer = Buffer.from("test", "utf8");
        const argBody = toBufferReadable(argBuffer);
        message.setBody(argBody);
      });
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
    context("when body is attachment data", function () {
      beforeEach(async function () {
        const rawData = Buffer.from("test", "utf8");
        const argBody = {
          content_type: "application/octet-stream",
          data: rawData.toString("base64"),
          length: rawData.length,
        };
        message.setHeader("Content-Type", "application/octet-stream").setBody(argBody);
      });
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
    context("when body is json data", function () {
      beforeEach(async function () {
        const argBody = { message: "hello, world" };
        message.setHeader("Content-Type", "application/json").setBody(argBody);
      });
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
    context("when body is undefined", function () {
      it("should return text", async function () {
        const returnText = await message.toText();
        expect(returnText).to.be.a("string");
      });
    });
  });
});
