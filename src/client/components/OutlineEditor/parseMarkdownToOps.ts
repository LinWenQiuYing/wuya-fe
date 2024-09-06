export type InsertOperator = {
  insert: string;
  attributes?: { header: number };
};

/**
 * 将markdown转换成 [Quill Delta Ops](https://quilljs.com/docs/guides/designing-the-delta-format#ops)
 *
 * @param md markdown串行化后的字符(即yaml多行之前用回车符连接), e.g.
 * needText 是否需要转化除标题外的内容
 * ```
 * # h1-xxx\n## h2-xx1\n## h2-xx2
 * ```
 */
const parseMarkdownToOps = (md: string, needText?: boolean) => {
  const list = md.split("\n").filter((item) => item);
  return list.reduce((ops: InsertOperator[], it) => {
    const match = /^(#+)\s+(.+)$/.exec(it);
    if (!match) {
      if (needText) ops.push({ insert: it }, { insert: "\n" });
    } else {
      const [, header, content] = match;
      ops.push({ insert: content }, { insert: "\n", attributes: { header: header.length } });
    }
    return ops;
  }, []);
};

export default parseMarkdownToOps;
