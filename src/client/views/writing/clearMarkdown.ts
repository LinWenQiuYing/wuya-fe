// 后端的数据中, ```相关的需要清除
const clearMarkdown = (source: string) => {
  return source.replaceAll(/```\w*\n/g, "\n").replaceAll(/```/g, "");
};

export default clearMarkdown;
