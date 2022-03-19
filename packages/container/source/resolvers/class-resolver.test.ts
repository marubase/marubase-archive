import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ClassResolver } from "./class-resolver.js";

describe("ClassResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is dependencies", function () {
      let resolver: ClassResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new ClassResolver(instance(mockRegistry), Date);
        scope = instance(mockScope);
        resolver.setDependencies("date");

        when(mockRegistry.resolve<string>("date", scope)).thenReturn("1990-09-03");
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(scope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no dependencies", function () {
      let resolver: ClassResolver;
      let scope: ScopeContract;
      beforeEach(async function () {
        resolver = new ClassResolver(instance(mockRegistry), Date);
        scope = instance(mockScope);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(scope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
  });
});
