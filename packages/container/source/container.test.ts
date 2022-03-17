import { expect } from "chai";
import { Container } from "./container.js";
import { Provider } from "./contracts/container.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
  });

  describe("get booted", function () {
    it("should return booted", async function () {
      expect(container.booted).to.be.false;
    });
  });

  describe("get providerMap", function () {
    it("should return provider map", async function () {
      expect(container.providerMap).to.be.an.instanceOf(Map);
    });
  });

  describe("get registry", function () {
    it("should return registry", async function () {
      expect(container.registry).to.be.an.instanceOf(Registry);
    });
  });

  describe("get scope", function () {
    it("should return scope", async function () {
      expect(container.scope).to.be.an.instanceOf(Scope);
    });
  });

  describe("#bind(binding)", function () {
    it("should return return registry binding", async function () {
      const registryBinding = container.bind(Date);
      expect(registryBinding).to.have.property("to");
      expect(registryBinding).to.have.property("toAlias");
      expect(registryBinding).to.have.property("toCallable");
      expect(registryBinding).to.have.property("toConstant");
      expect(registryBinding).to.have.property("toFunction");
      expect(registryBinding).to.have.property("toTag");
    });
  });

  describe("#boot()", function () {
    context("when container is booted", function () {
      context("and provider have boot method", function () {
        it("should boot container", async function () {
          const provider: Provider = {
            boot: async (): Promise<void> => undefined,
          };
          container.install("test", provider);
          await container.boot();
          expect(container.booted).to.be.true;

          await container.boot();
          expect(container.booted).to.be.true;
        });
      });
      context("and provider have no boot method", function () {
        it("should boot container", async function () {
          const provider: Provider = {};
          container.install("test", provider);
          await container.boot();
          expect(container.booted).to.be.true;

          await container.boot();
          expect(container.booted).to.be.true;
        });
      });
    });
    context("when container is not booted", function () {
      context("and provider have boot method", function () {
        it("should boot container", async function () {
          const provider: Provider = {
            boot: async (): Promise<void> => undefined,
          };
          container.install("test", provider);

          await container.boot();
          expect(container.booted).to.be.true;
        });
      });
      context("and provider have no boot method", function () {
        it("should boot container", async function () {
          const provider: Provider = {};
          container.install("test", provider);

          await container.boot();
          expect(container.booted).to.be.true;
        });
      });
    });
  });

  describe("#bound(binding)", function () {
    it("should return false", async function () {
      const bound = container.bound(Date);
      expect(bound).to.be.false;
    });
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const fork = container.fork();
      expect(fork).to.be.an.instanceOf(Container);
    });
  });

  describe("#install(name, provider)", function () {
    context("when provider have install method", function () {
      it("should return self", async function () {
        const provider: Provider = {
          install: (): void => undefined,
        };

        const self = container.install("test", provider);
        expect(self).to.equal(container);
      });
    });
    context("when provider have no install method", function () {
      it("should return self", async function () {
        const provider: Provider = {};

        const self = container.install("test", provider);
        expect(self).to.equal(container);
      });
    });
    context(
      "when container is booted and  provider have boot method",
      function () {
        it("should return self", async function () {
          const provider: Provider = {
            boot: async (): Promise<void> => undefined,
          };
          await container.boot();

          const self = container.install("test", provider);
          expect(self).to.equal(container);
        });
      },
    );
    context("when provider already exists", function () {
      context("and name is string", function () {
        it("should throw error", async function () {
          const provider: Provider = {};
          container.install("test", provider);

          const process = (): unknown => container.install("test", provider);
          expect(process).to.throw(ContainerError);
        });
      });
      context("and name is symbol", function () {
        it("should throw error", async function () {
          const provider: Provider = {};
          container.install(Symbol.for("test"), provider);

          const process = (): unknown =>
            container.install(Symbol.for("test"), provider);
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });

  describe("#installed(name)", function () {
    it("should return false", async function () {
      const installed = container.installed("test");
      expect(installed).to.be.false;
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    it("should return result", async function () {
      container.bind(Date).to(Date);

      const result = container.resolve<Date>(Date);
      expect(result).to.be.an.instanceOf(Date);
    });
  });

  describe("#shutdown()", function () {
    context("when provider have shutdown method", function () {
      it("should shutdown container", async function () {
        const provider: Provider = {
          shutdown: async (): Promise<void> => undefined,
        };
        container.install("test", provider);
        await container.boot();

        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when provider have no shutdown method", function () {
      it("should shutdown container", async function () {
        const provider: Provider = {};
        container.install("test", provider);
        await container.boot();

        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when container is not booted", function () {
      it("should shutdown container", async function () {
        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
  });

  describe("#unbind(binding)", function () {
    it("should return self", async function () {
      const self = container.unbind(Date);
      expect(self).to.equal(container);
    });
  });

  describe("#uninstall(name)", function () {
    context(
      "when container is booted and provider have shutdown method",
      function () {
        context("and provider have uninstall method", function () {
          it("should return self", async function () {
            const provider: Provider = {
              shutdown: async (): Promise<void> => undefined,
              uninstall: (): void => undefined,
            };
            container.install("test", provider);
            await container.boot();

            const self = container.uninstall("test");
            expect(self).to.equal(container);
          });
        });
        context("and provider have no uninstall method", function () {
          it("should return self", async function () {
            const provider: Provider = {
              shutdown: async (): Promise<void> => undefined,
            };
            container.install("test", provider);
            await container.boot();

            const self = container.uninstall("test");
            expect(self).to.equal(container);
          });
        });
      },
    );
    context("when provider have uninstall method", function () {
      it("should return self", async function () {
        const provider: Provider = {
          uninstall: (): void => undefined,
        };
        container.install("test", provider);

        const self = container.uninstall("test");
        expect(self).to.equal(container);
      });
    });
    context("when provider have no uninstall method", function () {
      it("should return self", async function () {
        const provider: Provider = {};
        container.install("test", provider);

        const self = container.uninstall("test");
        expect(self).to.equal(container);
      });
    });
    context("when provider does not exists", function () {
      context("and name is string", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.uninstall("test");
          expect(process).to.throw(ContainerError);
        });
      });
      context("and name is symbol", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.uninstall(Symbol("test"));
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });
});
