import { MultipartInterface } from "../contracts/multipart.contract.js";

export function isMultipart<Multipart extends MultipartInterface>(
  input: unknown,
): input is Multipart {
  return (
    typeof input === "object" &&
    input !== null &&
    "boundary" in (input as Multipart) &&
    "container" in (input as Multipart) &&
    "content" in (input as Multipart) &&
    "contentType" in (input as Multipart) &&
    "mimeType" in (input as Multipart) &&
    "setBoundary" in (input as Multipart) &&
    "setContent" in (input as Multipart) &&
    "setContentType" in (input as Multipart) &&
    "setMimeType" in (input as Multipart)
  );
}
