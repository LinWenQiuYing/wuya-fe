import memorize from "@/utils/memorize";

const parseHeadMarkdown = (markdown: string) => {
  const res = /^(#{1,6})\s+(.+)$/.exec(markdown);
  if (!res) return markdown;
  const [, , text] = res;
  return text;
};
export default memorize(parseHeadMarkdown);
