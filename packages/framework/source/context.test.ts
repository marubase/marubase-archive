import { Container } from "@marubase/container";
import { expect } from "chai";
import { Context } from "./context.js";
import { Request } from "./request.js";
import { Response } from "./response.js";

describe("Context", function () {
  let container: Container;
  let context: Context;
  let request: Request;
  beforeEach(async function () {
    container = new Container();
    request = new Request();
    context = new Context(container, request);
  });

  describe("get container", function () {
    it("should return container", async function () {
      const returnContainer = context.container;
      expect(returnContainer).to.be.an.instanceOf(Container);
    });
  });

  describe("get credential", function () {
    it("should return credential", async function () {
      const returnCredential = context.credential;
      expect(returnCredential).to.be.undefined;
    });
  });

  describe("get hash", function () {
    it("should return hash", async function () {
      const returnHash = context.hash;
      expect(returnHash).to.equal("");
    });
  });

  describe("get hostname", function () {
    it("should return hostname", async function () {
      const returnHostname = context.hostname;
      expect(returnHostname).to.equal("127.0.0.1");
    });
  });

  describe("get href", function () {
    it("should return href", async function () {
      const returnHref = context.href;
      expect(returnHref).to.equal("http://127.0.0.1/");
    });
  });

  describe("get method", function () {
    it("should return method", async function () {
      const returnMethod = context.method;
      expect(returnMethod).to.equal("GET");
    });
  });

  describe("get origin", function () {
    it("should return origin", async function () {
      const returnOrigin = context.origin;
      expect(returnOrigin).to.equal("http://127.0.0.1");
    });
  });

  describe("get path", function () {
    it("should return path", async function () {
      const returnPath = context.path;
      expect(returnPath).to.equal("/");
    });
  });

  describe("get port", function () {
    it("should return port", async function () {
      const returnPort = context.port;
      expect(returnPort).to.equal(80);
    });
  });

  describe("get protocol", function () {
    it("should return protocol", async function () {
      const returnProtocol = context.protocol;
      expect(returnProtocol).to.equal("HTTP/1.1");
    });
  });

  describe("get queries", function () {
    it("should return queries", async function () {
      const returnQueries = context.queries;
      expect(returnQueries).to.deep.equal({});
    });
  });

  describe("get request", function () {
    it("should return request", async function () {
      const returnRequest = context.request;
      expect(returnRequest).to.be.an.instanceOf(Request);
    });
  });

  describe("get scheme", function () {
    it("should return scheme", async function () {
      const returnScheme = context.scheme;
      expect(returnScheme).to.equal("http:");
    });
  });

  describe("get url", function () {
    it("should return url", async function () {
      const returnUrl = context.url;
      expect(returnUrl).to.be.an.instanceOf(URL);
    });
  });

  describe("#call(targetFn, ...args)", function () {
    it("should return result", async function () {
      const targetFn = (): Date => new Date();
      const returnResult = context.call(targetFn);
      expect(returnResult).to.be.an.instanceOf(Date);
    });
  });

  describe("#create(targetClass, ...args)", function () {
    it("should return result", async function () {
      const returnResult = context.create(Date);
      expect(returnResult).to.be.an.instanceOf(Date);
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    it("should return result", async function () {
      container.bind(Date).toSelf();

      const returnResult = context.resolve(Date);
      expect(returnResult).to.be.an.instanceOf(Date);
    });
  });

  describe("#resolveTag(tag, ...args)", function () {
    it("should return result", async function () {
      container.bind(Date).toSelf().setRegistryTags("test");

      const returnResult = context.resolveTag("test");
      expect(returnResult).to.be.an("array");
      expect(returnResult[0]).to.be.an.instanceOf(Date);
    });
  });

  describe("#respondWith(statusCode, statusText)", function () {
    beforeEach(async function () {
      container.bind("Response").to(Response);
    });
    describe("when status test is given", function () {
      it("should return response", async function () {
        const returnResponse = context.respondWith(200, "Test");
        expect(returnResponse).to.be.an.instanceOf(Response);
      });
    });
    describe("when status test is not given", function () {
      it("should return response", async function () {
        const returnResponse = context.respondWith(200);
        expect(returnResponse).to.be.an.instanceOf(Response);
      });
    });
  });
});
