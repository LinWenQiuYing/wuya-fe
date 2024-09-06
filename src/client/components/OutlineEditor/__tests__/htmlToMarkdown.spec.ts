import { describe, test, expect } from "vitest";
import htmlToMarkdown, { parseHTML, toMarkdown } from "../htmlToMarkdown";

describe("parseHTML", () => {
  test("normally", () => {
    const html: string =
      "<h1>h1 xxx</h1><p></p><h2>h2 xxx</h2><p></p><h3>h3 xxx</h3><h4>h4 xxx</h4><p>p xxx</p><p></p>";
    expect(parseHTML(html)).toStrictEqual([
      { tag: "h1", content: "h1 xxx" },
      { tag: "p", content: "" },
      { tag: "h2", content: "h2 xxx" },
      { tag: "p", content: "" },
      { tag: "h3", content: "h3 xxx" },
      { tag: "h4", content: "h4 xxx" },
      { tag: "p", content: "p xxx" },
      { tag: "p", content: "" },
    ]);
  });
});

describe("toMarkdown", () => {
  test("normally", () => {
    expect(toMarkdown({ tag: "h1", content: "h1 xxx" })).toBe("# h1 xxx");
    expect(toMarkdown({ tag: "h2", content: "h2 xxx" })).toBe("## h2 xxx");
    expect(toMarkdown({ tag: "h3", content: "h3 xxx" })).toBe("### h3 xxx");
    expect(toMarkdown({ tag: "h4", content: "h4 xxx" })).toBe("#### h4 xxx");
    expect(toMarkdown({ tag: "p", content: "" })).toBe("");
    expect(toMarkdown({ tag: "p", content: "" })).toBe("");
  });
});

describe("htmlToMarkdown", () => {
  test("normally", () => {
    expect(htmlToMarkdown("<h1>h1 xxx</h1>")).toBe("# h1 xxx");
    expect(htmlToMarkdown("<h2>h2 xxx</h2>")).toBe("## h2 xxx");
    expect(htmlToMarkdown("<h3>h3 xxx</h3>")).toBe("### h3 xxx");
    expect(htmlToMarkdown("<p>p xxx</p>")).toBe("");
    expect(htmlToMarkdown("<p></p>")).toBe("");
    const html: string =
      "<h1>h1 xxx</h1><p></p><h2>h2 xxx</h2><p></p><h3>h3 xxx</h3><h4>h4 xxx</h4><p>p xxx</p><p></p>";
    expect(htmlToMarkdown(html)).toBe("# h1 xxx\n## h2 xxx\n### h3 xxx\n#### h4 xxx");
  });
});
