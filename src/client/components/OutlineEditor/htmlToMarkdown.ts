type HTMLTagDescription = {
  tag: string;
  content: string;
};

// 将html转成json
export const parseHTML = (html: string): HTMLTagDescription[] => {
  const regExp = /<(\w+)>([^<]*)<\/\1>/g;
  const iterator = html.matchAll(regExp);
  const lines = [];
  for (const it of iterator) {
    const [, tag, content] = it;
    lines.push({ tag, content });
  }
  return lines;
};

export const toMarkdown = (desc: HTMLTagDescription): string => {
  switch (desc.tag) {
    case "h1":
      return `# ${desc.content}`;
    case "h2":
      return `## ${desc.content}`;
    case "h3":
      return `### ${desc.content}`;
    case "h4":
      return `#### ${desc.content}`;
    case "p":
      return desc.content;
    default:
      console.warn(`nonsupport tag "${desc.tag}" in outline html`);
      return "";
  }
};

export default function htmlToMarkdown(html: string): string {
  const descriptions = parseHTML(html);
  const list = descriptions.map(toMarkdown).filter((it) => it !== "");
  return list.join("\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
