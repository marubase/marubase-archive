import { expect } from "chai";
import { isReadable } from "./functions/is-readable.js";
import { Request } from "./request.js";

describe("Request", function () {
  describe("static from(readable)", function () {
    it("should return request", async function () {
      const source = new Request().setBody({ test: true });
      const argReadable = source.toStream();

      const returnRequest = await Request.from(argReadable);
      expect(returnRequest).to.be.an.instanceOf(Request);
    });
  });

  describe("get credential", function () {
    context("when there is username and password", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://test:secret@127.0.0.1/");
      });
      it("should return username and password", async function () {
        const returnCredential = request.credential as [string, string];
        expect(returnCredential).to.be.an("array");
        expect(returnCredential[0]).to.equal("test");
        expect(returnCredential[1]).to.equal("secret");
      });
    });
    context("when there is token", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://token@127.0.0.1/");
      });
      it("should return token", async function () {
        const returnCredential = request.credential;
        expect(returnCredential).to.equal("token");
      });
    });
    context("when there is no credential", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://127.0.0.1/");
      });
      it("should return undefined", async function () {
        const returnCredential = request.credential;
        expect(returnCredential).to.be.undefined;
      });
    });
  });

  describe("get hash", function () {
    context("when there is hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHash("test");
      });
      it("should return hash", async function () {
        const returnHash = request.hash;
        expect(returnHash).to.equal("#test");
      });
    });
    context("when there is no hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return empty hash", async function () {
        const returnHash = request.hash;
        expect(returnHash).to.equal("");
      });
    });
  });

  describe("get hostname", function () {
    context("when there is hostname", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHostname("test.com");
      });
      it("should return hostname", async function () {
        const returnHostname = request.hostname;
        expect(returnHostname).to.equal("test.com");
      });
    });
    context("when there is no hostname", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return hostname", async function () {
        const returnHostname = request.hostname;
        expect(returnHostname).to.equal("127.0.0.1");
      });
    });
  });

  describe("get href", function () {
    context("when there is href", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("https://test.com/test?key=value");
      });
      it("should return href", async function () {
        const returnHref = request.href;
        expect(returnHref).to.equal("https://test.com/test?key=value");
      });
    });
    context("when there is no href", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return href", async function () {
        const returnHref = request.href;
        expect(returnHref).to.equal("http://127.0.0.1/");
      });
    });
  });

  describe("get method", function () {
    context("when there is method", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setMethod("POST");
      });
      it("should return method", async function () {
        const returnMethod = request.method;
        expect(returnMethod).to.equal("POST");
      });
    });
    context("when there is no method", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return method", async function () {
        const returnMethod = request.method;
        expect(returnMethod).to.equal("GET");
      });
    });
  });

  describe("get origin", function () {
    context("when there is origin", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setOrigin("https://test.com:8080");
      });
      it("should return origin", async function () {
        const returnOrigin = request.origin;
        expect(returnOrigin).to.equal("https://test.com:8080");
      });
    });
    context("when there is no origin", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return origin", async function () {
        const returnOrigin = request.origin;
        expect(returnOrigin).to.equal("http://127.0.0.1");
      });
    });
  });

  describe("get path", function () {
    context("when there is path", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setPath("/test");
      });
      it("should return path", async function () {
        const returnPath = request.path;
        expect(returnPath).to.equal("/test");
      });
    });
    context("when there is no path", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return path", async function () {
        const returnPath = request.path;
        expect(returnPath).to.equal("/");
      });
    });
  });

  describe("get port", function () {
    context("when there is port", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setPort(8080);
      });
      it("should return port", async function () {
        const returnPort = request.port;
        expect(returnPort).to.equal(8080);
      });
    });
    context("when there is no port", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return port", async function () {
        const returnPort = request.port;
        expect(returnPort).to.equal(80);
      });
    });
    context("when there is no port and there is https scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setScheme("https");
      });
      it("should return port", async function () {
        const returnPort = request.port;
        expect(returnPort).to.equal(443);
      });
    });
  });

  describe("get queries", function () {
    context("when there is queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setQueries({ test: "true" });
      });
      it("should return queries", async function () {
        const returnQueries = request.queries;
        expect(returnQueries).to.deep.equal({ test: "true" });
      });
    });
    context("when there is no queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return queries", async function () {
        const returnQueries = request.queries;
        expect(returnQueries).to.deep.equal({});
      });
    });
  });

  describe("get scheme", function () {
    context("when there is scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setScheme("https");
      });
      it("should return scheme", async function () {
        const returnScheme = request.scheme;
        expect(returnScheme).to.equal("https:");
      });
    });
    context("when there is no scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return scheme", async function () {
        const returnScheme = request.scheme;
        expect(returnScheme).to.equal("http:");
      });
    });
  });

  describe("get url", function () {
    context("when there is url", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setUrl("https://test.com");
      });
      it("should return url", async function () {
        const returnUrl = request.url;
        expect(returnUrl).to.be.an.instanceOf(URL);
      });
    });
    context("when there is no url", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return url", async function () {
        const returnUrl = request.url;
        expect(returnUrl).to.be.an.instanceOf(URL);
      });
    });
  });

  describe("#clearCredential()", function () {
    context("when there is username and password", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://test:secret@127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.clearCredential();
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is token", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://token@127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.clearCredential();
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no credential", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.clearCredential();
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#clearHash()", function () {
    context("when there is hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHash("test");
      });
      it("should return self", async function () {
        const returnSelf = request.clearHash();
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.clearHash();
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#clearQueries()", function () {
    context("when there is queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setQueries({ test: "true" });
      });
      it("should return self", async function () {
        const returnSelf = request.clearQueries();
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.clearQueries();
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#clearQuery(key)", function () {
    context("when there is queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setQueries({ test: "true" });
      });
      it("should return self", async function () {
        const returnSelf = request.clearQuery("test");
        expect(returnSelf).to.equal(request);
        expect(returnSelf.queries.test).to.be.undefined;
      });
    });
    context("when there is no queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.clearQuery("test");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setCredential(tokenOrUsername, password)", function () {
    context("when there is username and password", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://test:secret@127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.setCredential("test", "secret");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is token", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://token@127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.setCredential("token");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no credential", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("http://127.0.0.1/");
      });
      it("should return self", async function () {
        const returnSelf = request.setCredential("test", "secret");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setHash(hash)", function () {
    context("when there is hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHash("test");
      });
      it("should return self", async function () {
        const returnSelf = request.setHash("test");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setHash("test");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setHostname(hostname)", function () {
    context("when there is hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHostname("test.com");
      });
      it("should return self", async function () {
        const returnSelf = request.setHostname("test.com");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no hash", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setHostname("test.com");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setHref(href)", function () {
    context("when there is href", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setHref("https://test.com/test?key=value");
      });
      it("should return self", async function () {
        const returnSelf = request.setHref("https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no href", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setHref("https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setMethod(method)", function () {
    context("when there is method", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setMethod("POST");
      });
      it("should return self", async function () {
        const returnSelf = request.setMethod("PUT");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no method", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setMethod("PUT");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setOrigin(origin)", function () {
    context("when there is origin", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setOrigin("https://test.com:8080");
      });
      it("should return self", async function () {
        const returnSelf = request.setOrigin("https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no origin", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setOrigin("https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setPath(path)", function () {
    context("when there is path", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setPath("/test");
      });
      it("should return self", async function () {
        const returnSelf = request.setPath("/test");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no path", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setPath("/test");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setPort(port)", function () {
    context("when there is port", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setPort(8080);
      });
      it("should return self", async function () {
        const returnSelf = request.setPort(8080);
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no port", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setPort(8080);
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no port and there is https scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setScheme("https");
      });
      it("should return self", async function () {
        const returnSelf = request.setPort(8080);
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setQueries(queries)", function () {
    context("when there is queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setQueries({ test: "true" });
      });
      it("should return self", async function () {
        const returnSelf = request.setQueries({ test: "true" });
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setQueries({ test: "true" });
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setQuery(key, value)", function () {
    context("when there is queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setQueries({ test: "true" });
      });
      it("should return self", async function () {
        const returnSelf = request.setQuery("test", "true");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no queries", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setQuery("test", "true");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setScheme(scheme)", function () {
    context("when there is scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setScheme("https");
      });
      it("should return self", async function () {
        const returnSelf = request.setScheme("https");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no scheme", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setScheme("https");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#setUrl(input, base)", function () {
    context("when there is url and url is url instance", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setUrl("https://test.com");
      });
      it("should return self", async function () {
        const returnSelf = request.setUrl(new URL("https://test.com"));
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is url and url is string", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
        request.setUrl("https://test.com");
      });
      it("should return self", async function () {
        const returnSelf = request.setUrl("/", "https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
    context("when there is no url", function () {
      let request: Request;
      beforeEach(async function () {
        request = new Request();
      });
      it("should return self", async function () {
        const returnSelf = request.setUrl("/", "https://test.com");
        expect(returnSelf).to.equal(request);
      });
    });
  });

  describe("#toStream()", function () {
    let request: Request;
    beforeEach(async function () {
      request = new Request();
    });
    it("should return stream", async function () {
      const returnStream = request.toStream();
      expect(isReadable(returnStream)).to.be.true;
    });
  });
});
