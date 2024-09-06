import { describe, test, expect } from "vitest";
import parseMarkdownToOps, { InsertOperator } from "../parseMarkdownToOps";

describe("parseMarkdownToOps", () => {
  test("normally", () => {
    expect(parseMarkdownToOps("# 夏季气温变化分析")).toStrictEqual([
      {
        insert: "夏季气温变化分析",
      },
      {
        insert: "\n",
        attributes: { header: 1 },
      },
    ] satisfies InsertOperator[]);

    expect(parseMarkdownToOps("# 夏季气温变化分析\n## 亚热带的气温在夏天的变化")).toStrictEqual([
      {
        insert: "夏季气温变化分析",
      },
      {
        insert: "\n",
        attributes: { header: 1 },
      },
      {
        insert: "亚热带的气温在夏天的变化",
      },
      {
        insert: "\n",
        attributes: { header: 2 },
      },
    ] satisfies InsertOperator[]);
  });
});
