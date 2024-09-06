function getUserAgent() {
  if (navigator && navigator.userAgent) {
    return navigator.userAgent;
  } else {
    return "";
  }
}

export const userAgent = getUserAgent();

export function isAndroid() {
  return userAgent.toLocaleLowerCase().includes("android");
}

export function isWeiXinBrower() {
  return userAgent.toLocaleLowerCase().includes("micromessenger");
}
