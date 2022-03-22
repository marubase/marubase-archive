import { MultipartContract } from "../contracts/multipart.contract.js";

export function isMultipart<Multipart extends MultipartContract>(
  input: unknown,
): input is Multipart {
  return (
    typeof input === "object" &&
    input !== null &&
    "boundary" in (input as MultipartContract) &&
    "contentType" in (input as MultipartContract) &&
    "mimeType" in (input as MultipartContract) &&
    "setBoundary" in (input as MultipartContract) &&
    "setContentType" in (input as MultipartContract) &&
    "setMimeType" in (input as MultipartContract) &&
    "toStream" in (input as MultipartContract)
  );
}
