import { test, expect, describe } from "vitest";
import getNamesSummary from "../getNamesSummary";

describe("getNamesSummary", () => {
  test("normally", () => {
    const summary = getNamesSummary(["a.pdf", "b.pdf"]);
    expect(summary).toBe("a,b");
  });

  test("omit if too long", () => {
    const summary = getNamesSummary([
      "tdc环境中gateway重启后, 页面异常的测试报告.pdf",
      "sophon-discover-fe-3.1.1-202307271842.tar.gz",
    ]);
    expect(summary.length).toBeLessThanOrEqual(13);
  });
});
