<template>
  <div ref="nodeRef"></div>
</template>
<script lang="ts" setup>
import Captcha from "packages/captcha";
import { onMounted, ref } from "vue";
import { userPrefix } from "@/utils/reqPrefix";

const nodeRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!nodeRef.value) return;
  const config = {
    // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
    requestCaptchaDataUrl: `${userPrefix}/auth/any/behavior-captcha`,
    // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
    validCaptchaUrl: "/check",
    // 验证码绑定的div块 (必选项,必须配置)
    bindEl: nodeRef.value,
    // 验证成功回调函数(必选项,必须配置)
    validSuccess: (res, c, tac) => {
      console.log("验证成功，后端返回的数据为", res);
      alert("验证成功");
      // 销毁验证码服务
      tac.destroyWindow();
    },
    // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
    validFail: (res, c, tac) => {
      // 验证失败后重新拉取验证码
      tac.reloadCaptcha();
    },
  };
  new Captcha(config).init();
});
</script>
