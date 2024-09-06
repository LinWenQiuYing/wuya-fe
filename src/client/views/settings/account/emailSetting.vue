<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions" :is-valid="isValid" @confirm_="onSubmit">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass"> </ArrowLeftBold>
      </template>
      <template #title>
        {{ userInfo.email ? "修改邮箱" : "绑定邮箱" }}
      </template>
      <template #confirm> 确定 </template>
    </account-header>
    <el-form ref="formRef" :rules="formRules" :model="form" :class="$style.emailForm">
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          :placeholder="userInfo?.email ? '请填写新邮箱' : '填写邮箱'"
          :class="$style.emailInput"
        />
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input v-model="form.verifyCode" placeholder="验证码" clearable :class="$style.codeInput">
          <template #append>
            <Countdown v-model="counting" :expired="expired" :class="$style.countdown" @click="verifyEmail" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div v-show="captchaVisible" :class="$style.mask" />
    <Teleport to="body">
      <div v-show="captchaVisible" ref="captchaRef" :class="$style.captcha"></div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import AccountHeader from "@/client/components/AccountHeader.vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateEmail } from "@/client/api/user";
import updateUserProfile from "@/sign/updateUserProfile";
import Countdown from "@/sign/components/Countdown.vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { optionType } from "@/client/components/types/component";
import { SlideCaptchaTrackData } from "#captcha";
import { getCaptcha, ResponseBody, sendEmailCaptcha } from "@/sign/api/sign";
import Captcha from "../../../../../packages/captcha/src/captcha/CaptchaContext";
import { useRouter } from "vue-router";
import isValidEmail from "@/sign/validators/isValidEmail";
import getEmailValidator from "@/sign/validators/getEmailValidator";
const userInfo = useUserInfo();
const router = useRouter();
const formRef = ref<FormInstance>();
const captchaRef = ref<HTMLElement | null>(null);
const captchaVisible = ref(false);
const captchaSend = ref(false);
const slotOptions: optionType[] = [
  {
    className: "title",
    name: "title",
  },
  {
    className: "confirm",
    name: "confirm",
  },
];

type EmailEditFormData = {
  email: string;
  verifyCode: string;
};

const validateCaptcha = async (id: string, payload: SlideCaptchaTrackData) => {
  return await sendEmailCaptcha(form.email, id, payload, false).catch((res: ResponseBody<null>) => {
    if (res.code !== 412) {
      ElMessage.error(res?.message);
    }
    return Promise.reject(res);
  });
};

const clearVerifyCodeValue = () => {
  if (form.verifyCode && form.verifyCode !== "") {
    form.verifyCode = "";
  }
};

const form = reactive<EmailEditFormData>({
  email: "",
  verifyCode: "",
});
// 倒计时的过期时间
const expired = ref<number>(0);
// 是否正在倒计时中, 正在倒计时时, 也需要更新过期时间expired
const counting = ref(false);

const formRules = reactive<FormRules<EmailEditFormData>>({
  email: [
    { required: true, message: "填写邮箱", trigger: "blur" },
    { validator: getEmailValidator("邮箱不合法"), trigger: "blur" },
  ],
  verifyCode: [{ required: true, message: "验证码", trigger: "blur" }],
});

// 开始倒计划
const startCountdown = () => {
  if (!captchaSend.value) {
    ElMessage.success("手机验证码已发送");
  }
  captchaSend.value = true;
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
const verifyEmail = () => {
  if (!form.email || form.email === "") {
    ElMessage.error("请先填写邮箱");
    return;
  }
  if (!isValidEmail(form.email)) {
    ElMessage.error("邮箱格式不正确");
    return;
  }
  captchaValidate(startCountdown);
};
const isValid = computed(() => {
  const { email, verifyCode } = form;
  if (email !== "" && isValidEmail(email) && verifyCode !== "") {
    return true;
  } else {
    return false;
  }
});
const onSubmit = async () => {
  const formInstance = formRef.value;
  if (!formInstance) {
    console.warn("找不到form实例");
    return;
  }
  const valid = await formInstance.validate().catch(console.log);
  if (!valid) {
    console.warn("表单未通过校验");
    return;
  }
  const payload = {
    email: form.email,
    code: form.verifyCode,
  };
  const userProfile = await updateEmail(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  if (!userProfile) return;
  ElMessage.success("邮箱修改成功");
  updateUserProfile(userProfile);
  setTimeout(() => {
    router.go(-1);
  }, 1000);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";
._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;
}

.emailForm {
  padding: 15px 15px 0;
}
.emailInput,
.codeInput {
  :global(.el-input__wrapper) {
    font-weight: 400;
    font-size: 16px;
    background: #ffffff;
    height: 42px;
    line-height: 42px;
  }
}
.emailInput {
  :global(.el-input__wrapper) {
    color: #2d364d;
    border: 1px solid #f4f2f2;
    padding-left: 12px;
    border-radius: 8px;
  }
}
.codeInput {
  :global(.el-input__wrapper) {
    padding-left: 18px;
    border: 1px solid #f4f2f2;
    border-right-color: transparent;
    border-radius: 8px;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
  :global(.el-input-group__append) {
    background-color: unset;
    border: 1px solid #f4f2f2;
    border-radius: 8px;
    border-left-color: transparent;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    & > button {
      padding-left: 8px;
    }
    &::before {
      content: "|";
      display: inline-block;
      font-weight: 400;
      font-size: 16px;
      color: #cccccc;
    }
  }
}
.captcha {
  width: 360px;
  height: 430px;
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
}
.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
