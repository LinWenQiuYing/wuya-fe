import URL from "@/utils/URL";

// 从 "某银行2023年党的建设工作情况总结报告-银行工作总结-好范文网" 这样的标题中取出 “好范文网”
const guessWebsiteName = (title: string): string | null => {
  const arr = title.split("-");
  if (arr.length === 1) return null;
  return arr[arr.length - 1];
};

const getHostname = (url: string): string => {
  return new URL(url).hostname.replace(/^www\./, "");
};

const getWebsiteName = (title: string, url: string) => {
  return guessWebsiteName(title) ?? getHostname(url);
};

export default getWebsiteName;
