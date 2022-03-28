import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { setInjectable } from "../functions/set-injectable.js";
import { ClassResolver } from "./class-resolver.js";

describe("ClassResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let instanceRegistry: RegistryInterface;
  let instanceScope: ScopeInterface;
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
    context("when target is injectable", function () {
      let resolver: ClassResolver;
      beforeEach(async function () {
        setInjectable(true, Date);

        resolver = new ClassResolver(instanceRegistry, Date);
        resolver.setDependencies("date");

        when(mockRegistry.resolve<string>("date", instanceScope)).thenReturn("1990-09-03");
      });
      it("should return instance", async function () {
        const returnInstance = resolver.resolve(instanceScope);
        expect(returnInstance).to.be.an.instanceOf(Date);
      });
    });
  });
});
