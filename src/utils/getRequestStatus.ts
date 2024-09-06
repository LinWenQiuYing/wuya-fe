import URL from "./URL";

export default function getRequestStatus(request: XMLHttpRequest) {
  return `Interface ${new URL(request.responseURL).pathname} ${request.statusText}`;
}
