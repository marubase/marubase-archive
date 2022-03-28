import { Container } from "@marubase/container";
import { expect } from "chai";
import { Context } from "./context.js";
import { RouteHandler } from "./contracts/router.contract.js";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { Router } from "./router.js";

describe("Router", function () {
  let container: Container;
  let router: Router;
  beforeEach(async function () {
    container = new Container();
    container.bind("Context").to(Context);
    container.bind("Request").to(Request);
    container.bind("Response").to(Response);
    router = new Router(container);
  });

  describe("get container", function () {
    it("should return container", async function () {
      const returnContainer = router.container;
      expect(returnContainer).to.be.an.instanceOf(Container);
    });
  });

  describe("#dispatch(request)", function () {
    describe("when there is handler", function () {
      beforeEach(async function () {
        router.handle(async (context) => {
          return context.respondWith(200).setBody({ random: Math.random() });
        });
      });
      it("should return response", async function () {
        const request = new Request();
        const returnResponse = await router.dispatch(request);
        expect(returnResponse).to.be.an.instanceOf(Response);
      });
    });
    describe("when there is nested handler", function () {
      beforeEach(async function () {
        const timeRouter = new Router(container);
        timeRouter.handle(async (context, next) => {
          if (!context.path.startsWith("/time")) return next();
          return context.respondWith(200).setBody({ time: new Date().toISOString() });
        });

        router.handle(timeRouter);
      });
      it("should return response", async function () {
        const request = new Request().setPath("/time");
        const returnResponse = await router.dispatch(request);
        expect(returnResponse).to.be.an.instanceOf(Response);
      });
    });
    describe("when there is no handler", function () {
      it("should return response", async function () {
        const request = new Request().setPath("/time");
        const returnResponse = await router.dispatch(request);
        expect(returnResponse).to.be.an.instanceOf(Response);
      });
    });
  });

  describe("#handle(handler)", function () {
    it("should return self", async function () {
      const handler: RouteHandler = async (context) => context.respondWith(200);
      const returnSelf = router.handle(handler);
      expect(returnSelf).to.equal(router);
    });
  });
});
