import $ from "jquery";
import { SlideCaptchaTrackData, InitConfig, CaptchaInitData, CaptchaValidator } from "../type";

class CaptchaConfig {
  bindEl: HTMLElement;
  getCaptcha: () => Promise<CaptchaInitData>;
  validateCaptcha: CaptchaValidator;

  get $bindEl(): JQuery<HTMLElement> {
    return $(this.bindEl);
  }

  constructor(config: InitConfig) {
    if (!config.bindEl) {
      throw new Error("[TAC] 必须配置 [bindEl]用于将验证码绑定到该元素上");
    }
    if (!config.getCaptcha) {
      throw new Error("[TAC] 必须配置 [getCaptcha]获取验证码数据");
    }
    if (!config.validateCaptcha) {
      throw new Error("[TAC] 必须配置 [validateCaptcha]验证验证码接口");
    }
    this.bindEl = config.bindEl;
    this.getCaptcha = config.getCaptcha;
    this.validateCaptcha = config.validateCaptcha;
    if (config.validSuccess) {
      this.validSuccess = config.validSuccess;
    }
    if (config.validFail) {
      this.validFail = config.validFail;
    }
    if (config.byPass) {
      this.byPass = config.byPass;
    }
  }

  byPass = () => {};

  // doPostSendRequest(requestParam) {
  //   return new Promise((resolve, reject) => {
  //     $.ajax({
  //       url: this.validCaptchaUrl,
  //       type: "POST",
  //       headers: requestParam.headers,
  //       data: JSON.stringify(requestParam),
  //       dataType: "json",
  //       contentType: "application/json;charset=UTF-8",
  //       success: (data) => {
  //         resolve(data);
  //       },
  //       error: (err) => {
  //         reject(err);
  //       },
  //     });
  //   });
  // }
  //
  // validCaptcha(captchaId: string, data: SlideCaptchaTrackData, c, tac) {
  //   const sendParam = {
  //     id: captchaId,
  //     data: data,
  //   };
  //   const request = this.doPostSendRequest(sendParam);
  //   return request.then((res) => {
  //     // 412
  //     if (res.code === 200) {
  //       const useTimes = (data.endSlidingTime - data.startSlidingTime) / 1000;
  //       c.showTips(`验证成功,耗时${useTimes}秒`, 1, () => this.validSuccess(res, c, tac));
  //     } else {
  //       let tipMsg = "验证失败，请重新尝试!";
  //       if (res.code) {
  //         if (res.code !== 4001) {
  //           tipMsg = "验证码被黑洞吸走了！";
  //         }
  //       }
  //       c.showTips(tipMsg, 0, () => this.validFail(res, c, tac));
  //     }
  //   });
  // }

  validSuccess(tac, response) {
    console.log("验证码校验成功， 请重写  [config.validSuccess] 方法， 用于自定义逻辑处理");
    tac.destroyWindow();
  }

  validFail(tac, response) {
    tac.reloadCaptcha();
  }
}

export { CaptchaConfig };
