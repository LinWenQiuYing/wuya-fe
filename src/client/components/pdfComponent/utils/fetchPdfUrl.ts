import fetchGetParamsFn from "@/client/components/pdfComponent/utils/fetchGetParams";
import appendAuthHeader from "@/sign/appendAuthHeader";
import { getSubString } from "@/client/utils";
import streamToBlob from "@/client/components/pdfComponent/utils/streamToBlob";
import { documentsPrefix } from "@/utils/reqPrefix";
import { baseURL } from "@/config";

const fetchPdfUrl = async (data: Record<string, any>) => {
  // 判断是新接口还是老接口
  const requestUrl = data?.document_id
    ? `${documentsPrefix}/highlight?item_id=${data.uid.substr(data.uid.indexOf(data?.document_id))}`
    : data?.positions
      ? `${documentsPrefix}/preview/finance`
      : fetchGetParamsFn(data.source, `${documentsPrefix}/preview/v1`, data.title.split("/"));

  const init: Record<string, any> = {
    method: data?.positions ? "post" : "get",
    headers: appendAuthHeader({
      "Content-Type": "application/json",
      responseType: "arraybuffer",
    }),
  };

  if (data?.positions) {
    init["body"] = JSON.stringify({
      docName: getSubString(data.title),
      image: false,
      positions: data.positions,
      pages: data.document_pages,
    });
  }

  const response = await fetch(baseURL + requestUrl, init);
  if (response.status !== 200) throw new Error("无法预览文件");
  const chunksData = await streamToBlob(response.body as ReadableStream<Uint8Array>);
  const url = URL.createObjectURL(chunksData);
  return url;
};

export default fetchPdfUrl;
