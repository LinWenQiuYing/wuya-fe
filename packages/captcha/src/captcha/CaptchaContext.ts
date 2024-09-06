import "./captcha.scss";
import Slider from "./slider/slider";
import Rotate from "./rotate/rotate";
import Concat from "./concat/concat";
import WordImageClick from "./word_image_click/word_image_click";
import template from "./captcha.html?raw";
import { CaptchaInitData, CaptchaType, CaptchaValidator, InitConfig, SlideCaptchaTrackData } from "./type";
import $ from "jquery";

function createCaptchaByType(type: CaptchaType) {
  switch (type) {
    case "SLIDER":
      return new Slider("#tianai-captcha-box");
    case "ROTATE":
      return new Rotate("#tianai-captcha-box");
    case "CONCAT":
      return new Concat("#tianai-captcha-box");
    case "WORD_IMAGE_CLICK":
      return new WordImageClick("#tianai-captcha-box");
    default:
      return null;
  }
}

export default class CaptchaContext<T = unknown> {
  container: HTMLElement;
  getCaptcha: () => Promise<CaptchaInitData>;
  validateCaptcha: CaptchaValidator<T>;
  onValidateSuccess?: (context: CaptchaContext, data: T) => void;
  onValidateError?: (context: CaptchaContext, data: T) => void;
  onClose?: () => void;
  currentCaptcha: Slider;

  get $container(): JQuery<HTMLElement> {
    return $(this.container);
  }

  constructor(config: InitConfig<T>) {
    this.container = config.container;
    this.getCaptcha = config.getCaptcha;
    this.validateCaptcha = config.validateCaptcha;
    this.onValidateSuccess = config.onValidateSuccess;
    this.onValidateError = config.onValidateError;
    this.onClose = config.onClose;
    this.#init();
  }

  #init() {
    this.destroyWindow();
    this.$container.append(template);
    this.$container.off();
    // 绑定按钮事件
    this.$container.on("click", ".refresh-btn", () => this.onRefresh());
    this.$container.on("click", ".close-btn", () => this.#onClose());
    // 加载验证码
    this.reloadCaptcha();
  }

  onRefresh() {
    this.reloadCaptcha();
  }

  #onClose() {
    this.destroyWindow();
    this.onClose?.();
  }
  reloadCaptcha() {
    this.showLoading();
    this.hideCtrlBar();
    this.destroyCaptcha(() => {
      this.createCaptcha();
    });
  }
  showLoading() {
    const $loading: JQuery = this.$container.find("#tianai-captcha-loading");
    $loading.show();
  }
  closeLoading() {
    const $loading: JQuery = this.$container.find("#tianai-captcha-loading");
    $loading.hide();
  }
  // 显示控制栏(控制栏目前仅一个刷新按钮)
  showCtrlBar() {
    const $bar: JQuery = this.$container.find(".slider-bottom");
    $bar.show();
  }
  // 隐藏控制栏(控制栏目前仅一个刷新按钮)
  hideCtrlBar() {
    const $bar: JQuery = this.$container.find(".slider-bottom");
    $bar.hide();
  }

  destroyWindow() {
    window.currentCaptcha = undefined;
    this.$container.find("#tianai-captcha-parent").remove();
  }

  openCaptcha() {
    setTimeout(() => {
      window.currentCaptcha.el.css("transform", "translateX(0)");
    }, 10);
  }

  createCaptcha() {
    this.getCaptcha()
      .then((data) => {
        this.closeLoading();
        this.showCtrlBar();
        if (data.captcha.type !== "SLIDER") {
          throw new Error("[TAC] 未知的验证码类型[" + data.captcha.type + "]");
        }
        const captcha = new Slider("#tianai-captcha-box");
        this.currentCaptcha = captcha;
        captcha.init(data, (d, c) => {
          // 验证
          const currentCaptchaData = captcha.currentCaptchaData;
          const data: SlideCaptchaTrackData = {
            bgImageWidth: currentCaptchaData.bgImageWidth,
            bgImageHeight: currentCaptchaData.bgImageHeight,
            sliderImageWidth: currentCaptchaData.sliderImageWidth,
            sliderImageHeight: currentCaptchaData.sliderImageHeight,
            startSlidingTime: currentCaptchaData.startTime,
            endSlidingTime: currentCaptchaData.stopTime,
            trackList: currentCaptchaData.trackArr,
          };
          if (captcha.type === "ROTATE_DEGREE" || captcha.type === "ROTATE") {
            data.bgImageWidth = c.currentCaptchaData.end;
          }
          // 清空
          const id: string = captcha.currentCaptchaData.currentCaptchaId;
          captcha.currentCaptchaData = undefined;
          // 调用验证接口
          this.validateCaptcha(id, data).then(
            (res) => {
              const useTimes = (data.endSlidingTime - data.startSlidingTime) / 1000;
              captcha.showTips(`验证成功,耗时${useTimes}秒`, 1, () => this.onValidateSuccess?.(this, res));
            },
            (res) => {
              if (res?.code === 412) {
                captcha.showTips("验证失败，请重新尝试!", 0, () => this.onValidateError?.(this, res));
              } else {
                this.onValidateError?.(this, res);
                this.destroyWindow();
              }
            },
          );
        });
        this.openCaptcha();
      })
      .catch(console.error);
  }

  destroyCaptcha(callback) {
    if (window.currentCaptcha) {
      window.currentCaptcha.el.css("transform", "translateX(300px)");
      setTimeout(() => {
        window.currentCaptcha.destroy();
        if (callback) {
          callback();
        }
      }, 500);
    } else {
      callback();
    }
  }
}
