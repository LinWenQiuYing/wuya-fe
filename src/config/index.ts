// 是否是electron环境
const isElectron = process.env.TARGET === "electron";

// 是否是web环境
const isWeb = process.env.TARGET === "web";

// 构建目标
export const target = {
  isElectron,
  isWeb,
};

export const baseURL: string = import.meta.env.PROD && isElectron ? "http://127.0.0.1:8090" : "";

// 是否是在通过手机浏览器访问页面
export const isMobile = /mobile/i.test(navigator.userAgent);

// 手机app需要在userAgent中添加关键字infinity
export const isApp = /infinity/i.test(navigator.userAgent);

// 是否是在苹果电脑上访问浏览器页面
export const isMacOS = /Macintosh/i.test(navigator.userAgent);
