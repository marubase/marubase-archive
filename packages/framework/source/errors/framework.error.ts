import { ResponseCode } from "../contracts/response.contract.js";

export class FrameworkError extends Error {
  public constructor(message?: string, public code: ResponseCode = 500) {
    super(message);
  }
}
