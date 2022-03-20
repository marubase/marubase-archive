import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ClassResolver } from "./class-resolver.js";

describe("ClassResolver", function () {
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
      let resolver: ClassResolver;
      beforeEach(async function () {
        resolver = new ClassResolver(instanceRegistry, Date);
        resolver.setDependencies("date");

        when(mockRegistry.resolve<string>("date", instanceScope)).thenReturn("1990-09-03");
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no dependencies", function () {
      let resolver: ClassResolver;
      beforeEach(async function () {
        resolver = new ClassResolver(instanceRegistry, Date);
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
  });
});
