import { expect } from "chai";
import { isReadable } from "./functions/is-readable.js";
import { Response } from "./response.js";

describe("Response", function () {
  describe("static from(readable)", function () {
    it("should return response", async function () {
      const source = new Response().setBody({ test: true });
      const argReadable = source.toStream();

      const returnResponse = await Response.from(argReadable);
      expect(returnResponse).to.be.an.instanceOf(Response);
    });
  });

  describe("get statusCode", function () {
    context("when there is status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
        response.setStatusCode(201);
      });
      it("should return status code", async function () {
        const returnStatusCode = response.statusCode;
        expect(returnStatusCode).to.equal(201);
      });
    });
    context("when there is no status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
      });
      it("should return status code", async function () {
        const returnStatusCode = response.statusCode;
        expect(returnStatusCode).to.equal(200);
      });
    });
  });

  describe("get statusText", function () {
    context("when there is status text", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
        response.setStatusText("Test");
      });
      it("should return status text", async function () {
        const returnStatusText = response.statusText;
        expect(returnStatusText).to.equal("Test");
      });
    });
    context("when there is no status text", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
      });
      it("should return status text", async function () {
        const returnStatusText = response.statusText;
        expect(returnStatusText).to.equal("OK");
      });
    });
  });

  describe("#setStatusCode(statusCode)", function () {
    context("when there is status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
        response.setStatusCode(201);
      });
      it("should return self", async function () {
        const returnSelf = response.setStatusCode(201);
        expect(returnSelf).to.equal(response);
      });
    });
    context("when there is no status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
      });
      it("should return self", async function () {
        const returnSelf = response.setStatusCode(201);
        expect(returnSelf).to.equal(response);
      });
    });
  });

  describe("#setStatusText(statusText)", function () {
    context("when there is status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
        response.setStatusText("Test");
      });
      it("should return self", async function () {
        const returnSelf = response.setStatusText("Test");
        expect(returnSelf).to.equal(response);
      });
    });
    context("when there is no status code", function () {
      let response: Response;
      beforeEach(async function () {
        response = new Response();
      });
      it("should return self", async function () {
        const returnSelf = response.setStatusText("Test");
        expect(returnSelf).to.equal(response);
      });
    });
  });

  describe("#toStream()", function () {
    let response: Response;
    beforeEach(async function () {
      response = new Response();
    });
    it("should return stream", async function () {
      const returnStream = response.toStream();
      expect(isReadable(returnStream)).to.be.true;
    });
  });
});
