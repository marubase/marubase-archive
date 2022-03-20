import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { Callable, ResolverContract } from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";

describe("Registry", function () {
  let mockResolver: ResolverContract;
  let mockScope: ScopeContract;
  let instanceResolver: ResolverContract;
  let instanceScope: ScopeContract;
  let registry: Registry;
  beforeEach(async function () {
    mockResolver = mock();
    mockScope = mock();
    instanceResolver = instance(mockResolver);
    instanceScope = instance(mockScope);
    registry = new Registry();
  });

  describe("get keyMap", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey("key", instanceResolver);
      });
      it("should return key map", async function () {
        const returnKeyMap = registry.keyMap;
        expect(returnKeyMap).to.be.an.instanceOf(Map);
      });
    });
    context("when there is no record", function () {
      it("should return key map", async function () {
        const returnKeyMap = registry.keyMap;
        expect(returnKeyMap).to.be.an.instanceOf(Map);
      });
    });
  });

  describe("get resolverFactory", function () {
    it("should return resolver factory", async function () {
      const returnResolverFactory = registry.resolverFactory;
      expect(returnResolverFactory).to.have.property("createCallableResolver");
      expect(returnResolverFactory).to.have.property("createClassResolver");
      expect(returnResolverFactory).to.have.property("createConstantResolver");
      expect(returnResolverFactory).to.have.property("createFunctionResolver");
      expect(returnResolverFactory).to.have.property("createRegistryKeyResolver");
    });
  });

  describe("#bind(key).to(constructor)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).to(Date);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).to(Date);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(key).toAlias(alias)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.bind("Date").toAlias(Date);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const returnResolver = registry.bind("Date").toAlias(Date);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(key).toCallable(callable)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const argCallable: Callable = [Date, "getNow"];
        const returnResolver = registry.bind("Date").toCallable(argCallable);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const argCallable: Callable = [Date, "getNow"];
        const returnResolver = registry.bind("Date").toCallable(argCallable);
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(key).toConstant(constant)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toConstant(new Date());
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toConstant(new Date());
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(key).toFunction(constant)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toFunction(() => new Date());
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toFunction(() => new Date());
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(key).toSelf()", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey(Date, instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toSelf();
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no record", function () {
      it("should return resolver", async function () {
        const returnResolver = registry.bind(Date).toSelf();
        expect(returnResolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when key is not a class", function () {
      it("should throw error", async function () {
        const run = (): unknown => registry.bind("Date").toSelf();
        expect(run).to.throw(ContainerError);
      });
    });
  });

  describe("#clearResolverByKey(key)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey("key", instanceResolver);
      });
      it("should return self", async function () {
        const returnSelf = registry.clearResolverByKey("key");
        expect(returnSelf).to.equal(registry);
      });
    });
    context("when there is no record", function () {
      it("should return self", async function () {
        const returnSelf = registry.clearResolverByKey("key");
        expect(returnSelf).to.equal(registry);
      });
    });
  });

  describe("#getResolverByKey(key)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey("key", instanceResolver);
      });
      it("should return resolver", async function () {
        const returnResolver = registry.getResolverByKey("key");
        expect(returnResolver).to.not.be.undefined;
      });
    });
    context("when there is no record", function () {
      it("should return undefined", async function () {
        const returnResolver = registry.getResolverByKey("key");
        expect(returnResolver).to.be.undefined;
      });
    });
  });

  describe("#resolve(resolvable, scope, ...args)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey("key", instanceResolver);

        when(mockResolver.scope).thenReturn("transient");
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(new Date());
      });
      it("should return instance", async function () {
        const returnInstance = registry.resolve<Date>("key", instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no record", function () {
      it("should throw error", async function () {
        const run = (): unknown => registry.resolve<Date>("key", instanceScope);
        expect(run).to.throw(ContainerError);
      });
    });
    context("when resolvable is callable", function () {
      beforeEach(async function () {
        registry.setResolverByKey("Date", instanceResolver);

        when(mockResolver.scope).thenReturn("transient");
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(new Date());
      });
      it("should return result", async function () {
        const returnResult = registry.resolve(["Date", "getTime"], instanceScope);
        expect(returnResult).to.be.a("number");
      });
    });
    context("when resolvable is callable string", function () {
      beforeEach(async function () {
        registry.setResolverByKey("Date", instanceResolver);

        when(mockResolver.scope).thenReturn("transient");
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(new Date());
      });
      it("should return result", async function () {
        const returnResult = registry.resolve("Date#getTime", instanceScope);
        expect(returnResult).to.be.a("number");
      });
    });
  });

  describe("#setResolverByKey(key, resolver)", function () {
    context("when there is record", function () {
      beforeEach(async function () {
        registry.setResolverByKey("key", instanceResolver);
      });
      it("should return self", async function () {
        const returnSelf = registry.setResolverByKey("key", instanceResolver);
        expect(returnSelf).to.equal(registry);
      });
    });
    context("when there is no record", function () {
      it("should return self", async function () {
        const returnSelf = registry.setResolverByKey("key", instanceResolver);
        expect(returnSelf).to.equal(registry);
      });
    });
  });
});
