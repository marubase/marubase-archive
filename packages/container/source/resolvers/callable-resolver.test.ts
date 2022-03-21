import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { Callable } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { setInjectable } from "../functions/set-injectable.js";
import { CallableResolver } from "./callable-resolver.js";

describe("CallableResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  let instanceRegistry: RegistryContract;
  let instanceScope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    instanceRegistry = instance(mockRegistry);
    instanceScope = instance(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is registry record", function () {
      let resolver: CallableResolver;
      beforeEach(async function () {
        const argCallable: Callable = [Date, "getTime"];
        resolver = new CallableResolver(instanceRegistry, argCallable);
        resolver.setDependencies(Date);

        when(mockRegistry.resolve<Date>(Date, instanceScope)).thenReturn(new Date());
      });
      it("should return result", async function () {
        const returnResult = resolver.resolve(instanceScope);
        expect(returnResult).to.be.a("number");
      });
    });
    context("when there is no registry record", function () {
      let resolver: CallableResolver;
      beforeEach(async function () {
        const argCallable: Callable = [Date, "getTime"];
        resolver = new CallableResolver(instanceRegistry, argCallable);

        when(mockRegistry.resolve<Date>(Date, instanceScope)).thenThrow(new ContainerError("test-error"));
      });
      it("should throw error", async function () {
        const run = (): unknown => resolver.resolve(instanceScope);
        expect(run).to.throw(ContainerError);
      });
    });
    context("when callable is injectable", function () {
      let resolver: CallableResolver;
      beforeEach(async function () {
        const argCallable: Callable = [Date, "getTime"];
        setInjectable(true, Date.prototype, "getTime");

        resolver = new CallableResolver(instanceRegistry, argCallable);
        resolver.setDependencies(Date);

        when(mockRegistry.resolve<Date>(Date, instanceScope)).thenReturn(new Date());
      });
      afterEach(async function () {
        setInjectable(false, Date.prototype, "getTime");
      });
      it("should return result", async function () {
        const returnResult = resolver.resolve(instanceScope);
        expect(returnResult).to.be.a("number");
      });
    });
  });
});
