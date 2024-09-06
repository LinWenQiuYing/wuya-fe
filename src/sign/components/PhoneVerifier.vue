<template>
  <el-input
    v-model="verifyCode"
    :class="[$style._, isSplitBar ? $style.split : $style.inline]"
    :placeholder="placeholder"
    :maxlength="6"
    clearable
  >
    <template #append>
      <Countdown v-model="counting" :expired="expired" :class="$style.countdown" @click="verifyPhone" />
    </template>
  </el-input>
  <Teleport to="body">
    <div v-show="captchaVisible" ref="captchaRef" :class="$style.captcha"></div>
  </Teleport>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import isValidPhone from "@/sign/validators/isValidPhone";
import { ElMessage } from "element-plus";
import { getCaptcha, sendPhoneCaptcha, ResponseBody } from "@/sign/api/sign";
import Captcha, { SlideCaptchaTrackData } from "#captcha";
import Countdown from "./Countdown.vue";

const emit = defineEmits<{
  sent: [];
}>();

const props = defineProps<{
  // 手机号
  phone: string;
  // 是否跳过手机号验证 (修改邮箱时, 先对旧手机号获取验证码, 这时会跳过手机号的验证)
  disableValidatePhone?: boolean;
  // 是否不再弹示验证码已发送的提示
  disableToastSent?: boolean;
  // 占位符
  placeholder?: string;
  // 手机号是否已存在 (对于通过手机号找回密码的场景, 邮箱需要已注册在库)
  phoneExistRequired?: boolean;
  /**
   * 控制栏(发送验证码的按钮及倒计时等)的显示风格
   * - inline: bar栏作为输入框的附加件
   * - split: bar栏和输入框是分离的
   */
  readonly barType?: "inline" | "split";
}>();
const verifyCode = defineModel<string>();
// 倒计时的过期时间
const expired = ref<number>(0);
// 是否正在倒计时中, 正在倒计时时, 也需要更新过期时间expired
const counting = ref(false);
const captchaVisible = ref(false);
const captchaRef = ref<HTMLElement | null>(null);
const placeholder = props.placeholder ?? "请填写验证码";
const isSplitBar = props.barType === "split";

const validateCaptcha = async (id: string, payload: SlideCaptchaTrackData) => {
  return await sendPhoneCaptcha(props.phone, id, payload, props.phoneExistRequired).catch(
    (res: ResponseBody<null>) => {
      if (res.code !== 412) {
        ElMessage.error(res?.message);
      }
      return Promise.reject(res);
    },
  );
};

const clearVerifyCodeValue = () => {
  if (verifyCode.value && verifyCode.value !== "") {
    verifyCode.value = "";
  }
};

// 开始倒计划
const startCountdown = () => {
  if (!props.disableToastSent) {
    ElMessage.success("手机验证码已发送");
  }
  emit("sent");
  expired.value = Date.now() + 1000 * 60;
  counting.value = true;
  clearVerifyCodeValue();
};

const captchaValidate = (callback: () => void) => {
  captchaVisible.value = true;
  new Captcha({
    container: captchaRef.value!,
    getCaptcha,
    validateCaptcha,
    // 验证成功回调函数(必选项,必须配置)
    onValidateSuccess: (captcha) => {
      // 销毁验证码服务
      captcha.destroyWindow();
      captchaVisible.value = false;
      // 成功后的回调
      callback();
    },
    onValidateError: (captcha, res: ResponseBody<null>) => {
      if (res.code === 412) {
        captcha.reloadCaptcha();
      } else {
        captchaVisible.value = false;
      }
    },
    onClose() {
      captchaVisible.value = false;
    },
  });
};

const verifyPhone = () => {
  if (!props.phone || props.phone === "") {
    ElMessage.error("请先填写手机号");
    return;
  }
  if (!props.disableValidatePhone && !isValidPhone(props.phone)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  captchaValidate(startCountdown);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  --el-color-info: theme.$text-color-primary;

  :global(.el-input-group__append) {
    background-color: unset;
  }
}

.inline {
  :global(.el-input-group__append) {
    border: 1px solid #d6dae6;
    margin: 0 -1px;

    &:hover {
      border-color: theme.$color-primary;
      color: theme.$color-primary;
    }
  }

  .countdown {
    margin: 0 -20px;
  }
}

.split {
  :global(.el-input__wrapper) {
    border-bottom-right-radius: var(--el-input-border-radius);
    border-top-right-radius: var(--el-input-border-radius);
  }

  .countdown {
    color: theme.$color-primary;
    padding: 0;
    text-align: right;
    margin: 0 -20px 0 0;

    &:hover {
      opacity: 0.9;
    }
  }
}

.captcha {
  width: 360px;
  height: 430px;
  position: fixed;
  z-index: 20000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
