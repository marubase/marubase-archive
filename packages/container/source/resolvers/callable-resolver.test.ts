import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import {
  RegistryInterface,
  ResolvableCallable,
} from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { CallableResolver } from "./callable-resolver.js";

describe("CallableResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let scope: ScopeInterface;
  let callableResolver: CallableResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    callableResolver = new CallableResolver(registry, [Date, "getTime"]);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is binding", function () {
      context("and there is method", function () {
        it("should return result", async function () {
          when(mockRegistry.resolve<Date>(Date, scope)).thenReturn(new Date());

          const result = callableResolver.resolve(scope);
          expect(result).to.be.a("number");
        });
      });
      context("and there is no method", function () {
        context("and target#method is Function", function () {
          it("should throw error", async function () {
            when(mockRegistry.resolve<{}>(Date, scope)).thenReturn({});

            const callable = [Date, "getTime"] as ResolvableCallable;
            callableResolver = new CallableResolver(registry, callable);

            const process = (): unknown => callableResolver.resolve(scope);
            expect(process).to.throw(ContainerError);
          });
        });
        context("and target#method is string", function () {
          it("should throw error", async function () {
            when(mockRegistry.resolve<{}>("Date", scope)).thenReturn({});

            const callable = ["Date", "getTime"] as ResolvableCallable;
            callableResolver = new CallableResolver(registry, callable);

            const process = (): unknown => callableResolver.resolve(scope);
            expect(process).to.throw(ContainerError);
          });
        });
        context("and target#method is symbol", function () {
          it("should throw error", async function () {
            when(
              mockRegistry.resolve<{}>(Symbol.for("Date"), scope),
            ).thenReturn({});

            const callable = [
              Symbol.for("Date"),
              Symbol.for("getTime"),
            ] as ResolvableCallable;
            callableResolver = new CallableResolver(registry, callable);

            const process = (): unknown => callableResolver.resolve(scope);
            expect(process).to.throw(ContainerError);
          });
        });
      });
    });
    context("when there is no binding", function () {
      it("should throw error", async function () {
        when(mockRegistry.resolve(Date, scope)).thenThrow(
          new ContainerError("test error"),
        );

        const process = (): unknown => callableResolver.resolve(scope);
        expect(process).to.throw(ContainerError);
      });
    });
  });
});
