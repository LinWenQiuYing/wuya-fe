import "../common/common.scss";
import "./slider.scss";
import $ from "jquery";
import {
  CommonCaptcha,
  closeTips,
  down,
  drawBgImage,
  initConfig,
  showTips,
  destroyEvent,
} from "../common/common";
import template from "./template.html?raw";
import { CaptchaInitData } from "../type";

/**
 * 滑动验证码
 */

const TYPE = "SLIDER";

class Slider extends CommonCaptcha {
  type: "SLIDER";
  boxEl: JQuery<HTMLElement>;
  el: JQuery<HTMLElement>;
  endCallback: () => void;

  constructor(divId: JQuery.Selector) {
    super();
    this.boxEl = $(divId);
    this.type = TYPE;
    this.currentCaptchaData = {};
  }
  init(captchaData: CaptchaInitData, endCallback) {
    // 重载样式
    this.destroy();
    this.boxEl.append(template);
    this.el = $(this.boxEl.find("#tianai-captcha"));
    // 按钮绑定事件
    this.el.find(".slider-move-btn").on("mousedown", down);
    this.el.find(".slider-move-btn").on("touchstart", down);
    // 绑定全局
    window.currentCaptcha = this;
    // 载入验证码
    this.loadCaptchaForData(captchaData);
    this.endCallback = endCallback;
  }
  showTips(msg, type, callback) {
    showTips(this.el, msg, type, callback);
  }
  closeTips(callback) {
    closeTips(this.el, callback);
  }

  destroy() {
    const existsCaptchaEl = this.boxEl.children("#tianai-captcha");
    if (existsCaptchaEl) {
      existsCaptchaEl.remove();
    }
    destroyEvent();
  }
  doMove() {
    const moveX = this.currentCaptchaData.moveX;
    this.el.find(".slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)");
    this.el.find("#tianai-captcha-slider-img-div").css("transform", "translate(" + moveX + "px, 0px)");
    this.el.find("#tianai-captcha-slider-move-track-mask").css("width", moveX + "px");
  }
  loadCaptchaForData(data: CaptchaInitData) {
    const bgImg = this.el.find("#tianai-captcha-slider-bg-img");
    const sliderImg = this.el.find("#tianai-captcha-slider-move-img");
    bgImg.attr("src", data.captcha.backgroundImage);
    sliderImg.attr("src", data.captcha.templateImage);
    bgImg.on("load", () => {
      this.currentCaptchaData = initConfig(
        bgImg.width(),
        bgImg.height(),
        sliderImg.width(),
        sliderImg.height(),
        300 - 63 + 5,
      );
      this.currentCaptchaData.currentCaptchaId = data.id;
      // 重组
      drawBgImage(data.captcha, "tianai-captcha-slider-bg-canvas", "tianai-captcha-slider-bg-img", 50);
    });
  }
}

export default Slider;
