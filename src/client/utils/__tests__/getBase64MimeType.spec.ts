import { describe, test, expect } from "vitest";
import getBase64MimeType from "../getBase64MimeType";

describe("getBase64MimeType", () => {
  test("it returns base64 MIME-TYPE", () => {
    expect(getBase64MimeType("data:application/octet-stream;base64,AAEC")).toBe("application/octet-stream");
  });
});
