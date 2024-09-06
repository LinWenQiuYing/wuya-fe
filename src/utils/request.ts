import axios, { AxiosError, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import reAuth from "@/sign/reAuth";
import getRequestStatus from "./getRequestStatus";
import appendAuthHeaderInConfig from "@/sign/appendAuthHeaderInConfig";
import { baseURL } from "@/config";

const service = axios.create({
  timeout: 360 * 1000,
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const uploadService = axios.create({
  baseURL,
}); // 上传文件取消超时限制
const blobService = axios.create({
  timeout: 360 * 1000,
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "blob", // 设置响应数据类型为blob
});

const defaultResponseResolvedInterceptor = (response: AxiosResponse) => {
  const res = response.data;
  if (
    response.headers["content-type"] &&
    (response.headers["content-type"].indexOf("octet-stream") > -1 ||
      response.headers["content-type"].indexOf("application/pdf;charset=UTF-8") > -1 ||
      response.headers["content-type"].indexOf(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      ) > -1)
  ) {
    return {
      file: res,
      fileName: decodeURIComponent(response.headers["content-disposition"].split("attachment;filename=")[1]),
    };
  } else {
    if (response.status >= 200 && response.status <= 299) {
      return res;
    } else {
      // ElMessageBox.alert(res.msg, "提示", { confirmButtonText: "确定" });
      return Promise.reject(res);
    }
  }
};

const defaultResponseRejectedInterceptor = async <T>({ response, request }: AxiosError<T>) => {
  if (!response || !response.status) {
    return Promise.reject("Unknown response");
  }
  const data = response.data instanceof ArrayBuffer ? transformBuffer(response.data) : response.data;
  switch (response.status) {
    case 401:
    case 403:
      await reAuth({ remote: true }).catch(console.error);
      break;
    default: // 全局返回接口信息的返回错误
      ElMessage.error(data.detail || data.message || getRequestStatus(request));
      break;
  }
  return Promise.reject(response);
};

service.interceptors.response.use(defaultResponseResolvedInterceptor, defaultResponseRejectedInterceptor);
uploadService.interceptors.response.use(
  defaultResponseResolvedInterceptor,
  defaultResponseRejectedInterceptor,
);
blobService.interceptors.response.use(defaultResponseResolvedInterceptor, defaultResponseRejectedInterceptor);

service.interceptors.request.use(appendAuthHeaderInConfig);
uploadService.interceptors.request.use(appendAuthHeaderInConfig);
blobService.interceptors.request.use(appendAuthHeaderInConfig);

export { blobService, service, uploadService };

function transformBuffer(data: ArrayBuffer) {
  const decoder = new TextDecoder("utf-8");
  const jsonStringFromBuffer = decoder.decode(data);
  return JSON.parse(jsonStringFromBuffer) as unknown as Record<string, string>;
}
