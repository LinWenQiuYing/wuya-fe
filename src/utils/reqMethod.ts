import { blobService, service, uploadService } from "./request";
import { Api } from "@/client/types";
import { CancelToken } from "axios";

export function get<T>(url: string, params?: unknown): Promise<Api<T>> {
  return service({
    method: "GET",
    url,
    params,
  });
}

export function getBlob(url: string, params: unknown): Promise<unknown> {
  return blobService({
    method: "GET",
    url,
    params,
  });
}

export function post<T>(url: string, data?: unknown, cancelToken?: CancelToken): Promise<Api<T>> {
  return service({
    method: "POST",
    url,
    data,
    cancelToken,
  });
}

export function upload<T>(url: string, data: unknown, cancelToken?: CancelToken): Promise<Api<T>> {
  return uploadService({
    method: "POST",
    url,
    data,
    cancelToken,
  });
}

export function deleteReq(url: string, params: unknown) {
  return service({
    method: "DELETE",
    url,
    params,
  });
}

export function put(url: string, params: unknown) {
  return service({
    method: "put",
    url,
    data: params,
  });
}
