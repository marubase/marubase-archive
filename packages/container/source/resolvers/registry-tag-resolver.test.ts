import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { RegistryTagResolver } from "./registry-tag-resolver.js";

describe("RegistryTagResolver", function () {
  let mockRegistry: RegistryContract;
  let mockResolver: ResolverContract;
  let mockScope: ScopeContract;
  let instanceRegistry: RegistryContract;
  let instanceResolver: ResolverContract;
  let instanceScope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockResolver = mock();
    mockScope = mock();
    instanceRegistry = instance(mockRegistry);
    instanceResolver = instance(mockResolver);
    instanceScope = instance(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is tagged resolver", function () {
      let resolver: RegistryTagResolver;
      this.beforeEach(async function () {
        resolver = new RegistryTagResolver(instanceRegistry, "tag");

        when(mockRegistry.getResolverByTag("tag")).thenReturn([instanceResolver]);
        when(mockResolver.resolve<Date>(instanceScope)).thenReturn(new Date());
        when(mockRegistry.resolve<string>("date", instanceScope)).thenReturn("1990-09-03");
      });
      it("should return instances", async function () {
        const returnInstances = resolver.resolve<Date[]>(instanceScope);
        expect(returnInstances).to.be.an("array");
        expect(returnInstances).to.have.lengthOf(1);
        expect(returnInstances[0]).to.be.an.instanceOf(Date);
      });
    });
    context("when there is no tagged resolver", function () {
      let resolver: RegistryTagResolver;
      this.beforeEach(async function () {
        resolver = new RegistryTagResolver(instanceRegistry, "tag");

        when(mockRegistry.getResolverByTag("tag")).thenReturn([]);
      });
      it("should return instances", async function () {
        const returnInstances = resolver.resolve(instanceScope);
        expect(returnInstances).to.be.an("array");
        expect(returnInstances).to.have.lengthOf(0);
      });
    });
  });
});
