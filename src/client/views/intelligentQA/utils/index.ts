function getFavicon(url: string) {
  return new URL(url).origin + "/favicon.ico";
}

//公司根据股票代码去重
// data = {'公司1':{code:1,name:公司1}，公司11:{code:1,name:公司1}}
function getCompanies(data: Record<string, { code: string; name: string }>) {
  const obj = {};
  if (data) {
    Object.entries(data).map(([key, { code, name }]) => {
      if (!obj[code]) {
        obj[code] = name;
      }
    });
  }
  return obj;
}
function formatReference(reference: Record<string, string>[]) {
  const data = reference.map((item: Record<string, string>, index: number) => {
    const text = item?.news_link || item.title;
    const order = index + 1;
    return `${order}: ${text}\n`;
  });
  return data.join("");
}
function addAnchorreplacer(match: string, p1: string, p2: string, p3: string): string {
  return `[${p2}]`;
}
export { getFavicon, getCompanies, formatReference, addAnchorreplacer };
