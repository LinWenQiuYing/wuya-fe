/// 微信小程序相关方法
import { isWeiXinBrower } from "./devices";
import WX from "../../public/jweixin/types";
import { ref } from "vue";
import { ElMessage } from "element-plus";

// jwexin sdk加载完成后，会把 wx 挂在 window 下
declare let wx: typeof WX | undefined;

interface MiniProgramEnv {
  miniprogram?: boolean;
}

export const isMiniProgram = ref(false);

export function initWXSDK() {
  if (!isWeiXinBrower() && !navigator.userAgent?.includes("miniProgram")) return;
  if (!wx) {
    ElMessage.error("微信SDK加载失败");
    return;
  }
  initConfig();
  initState();
}

export function initConfig() {
  // https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
  wx?.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: "wxa2fdadf7105c84f5", // 必填，公众号的唯一标识
    timestamp: 1, // 必填，生成签名的时间戳
    nonceStr: "none", // 必填，生成签名的随机串
    signature: "none", // 必填，签名（不调JS API可以不填签名）
    jsApiList: [], // 必填，需要使用的JS接口列表
  });
}

export function initState() {
  wx?.ready(() => {
    // https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
    wx?.miniProgram?.getEnv((env?: MiniProgramEnv) => {
      isMiniProgram.value = !!env?.miniprogram;
    });
  });
}

// 页面跳转相关方法是用户触发的，不需要在 wx.ready 回调中执行
export function navigateTo(url: string) {
  wx?.miniProgram?.navigateTo({ url });
}

export function reLaunch(url: string) {
  wx?.miniProgram?.reLaunch({ url });
}

/**
 * 登录成功后，回到小程序首页，携带回调地址（小程序侧会清空页面栈。从设置页登录成功，返回首页）
 * @param redirect 回调地址
 */
export function reLaunchHome(redirect: string) {
  if (redirect.startsWith("/settings")) {
    const search = redirect.split("?")[1];
    redirect = search ? `?${search}` : "";
  }
  reLaunch(`/pages/index/index?url=${encodeURIComponent(redirect)}`);
}

class WXSignUtils {
  // 是否已经跳转到小程序登录页（h5页面的状态会保留）
  private isInSignPage: boolean;
  private callbacks: Array<() => void>;

  constructor() {
    this.isInSignPage = false;
    this.addEventListener();
    this.callbacks = [];
  }

  private addEventListener() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isInSignPage) {
        this.isInSignPage = false;
        this.callbacks.forEach((cb) => cb());
      }
    });
  }

  // 从h5跳小程序页面，再返回时，执行相应回调
  addSignPageBackCallback(fn: () => void) {
    this.callbacks.push(fn);
  }

  navigateToSign(redirect: string) {
    if (this.isInSignPage) return;
    this.isInSignPage = true;
    location.reload();
    navigateTo(`/pages/login/index?redirect=${encodeURIComponent(redirect)}`);
  }

  logout() {
    if (location.pathname.startsWith("/settings")) {
      location.href = location.origin;
    } else {
      location.reload();
    }
  }
}

export const wxSignUtils = new WXSignUtils();
