import { blobService, service, uploadService } from "./request";

export function get(url: string, params: unknown): Promise<unknown> {
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

export function post(url: string, data: unknown): Promise<unknown> {
  return service({
    method: "POST",
    url,
    data,
  });
}

export function upload(url: string, data: unknown): Promise<unknown> {
  return uploadService({
    method: "POST",
    url,
    data,
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
