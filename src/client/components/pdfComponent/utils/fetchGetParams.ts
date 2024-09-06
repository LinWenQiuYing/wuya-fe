const fetchGetParamsFn = (source: string, url: string, strArr: string[]) => {
  const paramsArray: string[] = [];
  const pdfName = strArr[0];
  const year = source === "law" ? 0 : strArr[1].replace(/[^0-9]/gi, "");
  const pageIndex = source === "law" ? 1 : 2;
  const pageStartIdx = strArr[pageIndex].indexOf("第");
  const pageEndIdx = strArr[pageIndex].indexOf("页");
  const pages = strArr[pageIndex].substring(pageStartIdx + 1, pageEndIdx);
  const pageSplit = pages.split("-");
  let pageStart = "";
  let pageEnd = "";
  if (pageSplit.length === 2) {
    pageStart = pageSplit[0];
    pageEnd = pageSplit[1];
  } else if (pageSplit.length === 1) {
    pageStart = pageSplit[0];
    pageEnd = pageSplit[0];
  }

  const params: Record<string, string | number> = {
    pdfName,
    businessType: source === "law" ? "law" : "report",
    year,
    pageStart,
    pageEnd,
  };

  //拼接参数
  Object.keys(params).forEach((key) => paramsArray.push(key + "=" + params[key]));
  if (url.search(/\?/) === -1) {
    url += "?" + paramsArray.join("&");
  } else {
    url += "&" + paramsArray.join("&");
  }
  return url;
};
export default fetchGetParamsFn;
