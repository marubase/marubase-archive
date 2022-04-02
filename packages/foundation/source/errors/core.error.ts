import { ResponseCode } from "../contracts/response.contract.js";

export class CoreError extends Error {
  public constructor(message?: string, public code: ResponseCode = 500) {
    super(message);
    this.name = this.constructor.name;
  }
}
