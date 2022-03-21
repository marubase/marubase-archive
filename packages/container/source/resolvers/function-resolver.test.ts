import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { setInjectable } from "../functions/set-injectable.js";
import { FunctionResolver } from "./function-resolver.js";

describe("FunctionResolver", function () {
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
    context("when there is dependencies", function () {
      let resolver: FunctionResolver;
      beforeEach(async function () {
        resolver = new FunctionResolver(instanceRegistry, (format: string) => new Date(format));
        resolver.setDependencies("date");

        when(mockRegistry.resolve<string>("date", instanceScope)).thenReturn("1990-09-03");
      });
      it("should return result", async function () {
        const returnResult = resolver.resolve(instanceScope);
        expect(returnResult).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no dependencies", function () {
      let resolver: FunctionResolver;
      beforeEach(async function () {
        resolver = new FunctionResolver(instanceRegistry, (format: string) => new Date(format));
      });
      it("should return result", async function () {
        const returnResult = resolver.resolve(instanceScope);
        expect(returnResult).to.be.an.instanceOf(Date);
      });
    });
    context("when target is injectable", function () {
      let resolver: FunctionResolver;
      beforeEach(async function () {
        const targetFn = (format: string): Date => new Date(format);
        setInjectable(true, targetFn);

        resolver = new FunctionResolver(instanceRegistry, targetFn);
        resolver.setDependencies("date");

        when(mockRegistry.resolve<string>("date", instanceScope)).thenReturn("1990-09-03");
      });
      it("should return result", async function () {
        const returnResult = resolver.resolve(instanceScope);
        expect(returnResult).to.be.an.instanceOf(Date);
      });
    });
  });
});
