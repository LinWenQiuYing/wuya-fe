import { test, expect, describe } from "vitest";
import removeExtension from "../removeExtension";

describe("removeExtension", () => {
  test("normally", () => {
    expect(removeExtension("CORS.pdf")).toBe("CORS");
    expect(removeExtension("docker.tar.gz")).toBe("docker.tar");
  });
});
