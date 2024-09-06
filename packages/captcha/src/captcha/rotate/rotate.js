import "../slider/slider.scss";
import "./rotate.scss";
import $ from "jquery";
import { CommonCaptcha, down, drawBgImage, initConfig, destroyEvent } from "../common/common";

/**
 * 滑动验证码
 */

const TYPE = "ROTATE";
const template = `
<div id="tianai-captcha" class="tianai-captcha-slider tianai-captcha-rotate">
    <div class="slider-tip">
        <span id="tianai-captcha-slider-move-track-font">拖动滑块完成拼图</span>
    </div>
    <div class="content">
        <div class="bg-img-div">
            <img id="tianai-captcha-slider-bg-img" src="" alt/>
            <canvas id="tianai-captcha-slider-bg-canvas"></canvas>
        </div>
        <div class="rotate-img-div" id="tianai-captcha-slider-img-div">
            <img id="tianai-captcha-slider-move-img" src="" alt/>
        </div>
         <div class="tianai-captcha-tips" id="tianai-captcha-tips">验证失败，请重新尝试</div>
    </div>
    <div class="slider-move">
        <div class="slider-move-track">
            <div id="tianai-captcha-slider-move-track-mask"></div>
            <div class="slider-move-shadow"></div>
        </div>
        <div class="slider-move-btn" id="tianai-captcha-slider-move-btn">
        </div>
    </div>
</div>
`;
class Rotate extends CommonCaptcha {
  constructor(divId) {
    super();
    this.boxEl = $(divId);
    this.type = TYPE;
    this.currentCaptchaData = {};
  }
  init(captchaData, endCallback, loadSuccessCallback) {
    // 重载样式
    this.destroy();
    this.boxEl.append(template);
    this.el = $(this.boxEl.find("#tianai-captcha"));
    // 按钮绑定事件
    this.el.find("#tianai-captcha-slider-move-btn").mousedown(down);
    this.el.find("#tianai-captcha-slider-move-btn").on("touchstart", down);
    // 绑定全局
    window.currentCaptcha = this;
    // 载入验证码
    this.loadCaptchaForData(this, captchaData);
    this.endCallback = endCallback;
    if (loadSuccessCallback) {
      // 加载成功
      loadSuccessCallback(this);
    }
    return this;
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
    this.el.find("#tianai-captcha-slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)");
    this.el
      .find("#tianai-captcha-slider-move-img")
      .css("transform", "rotate(" + moveX / (this.currentCaptchaData.end / 360) + "deg)");
    this.el.find("#tianai-captcha-slider-move-track-mask").css("width", moveX + "px");
  }
  loadCaptchaForData(that, data) {
    const bgImg = that.el.find("#tianai-captcha-slider-bg-img");
    const sliderImg = that.el.find("#tianai-captcha-slider-move-img");
    bgImg.attr("src", data.captcha.backgroundImage);
    sliderImg.attr("src", data.captcha.templateImage);
    bgImg.on("load", () => {
      that.currentCaptchaData = initConfig(
        bgImg.width(),
        bgImg.height(),
        sliderImg.width(),
        sliderImg.height(),
        300 - 63 + 5,
      );
      that.currentCaptchaData.currentCaptchaId = data.id;
      // 重组
      drawBgImage(data.captcha, "tianai-captcha-slider-bg-canvas", "tianai-captcha-slider-bg-img", 50);
    });
  }
}

export default Rotate;
