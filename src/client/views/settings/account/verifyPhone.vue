<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass"> </ArrowLeftBold>
      </template>
      <template #title> 设置密码 </template>
    </account-header>
    <div :class="$style.wrap">
      <h3>请验证手机号</h3>
      <el-form ref="formRef" :rules="formRules" :model="form" :class="$style.phoneForm">
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="输入手机号" maxlength="11" :class="$style.phoneInput" />
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-input
            v-model="form.verifyCode"
            placeholder="验证码"
            clearable
            :class="$style.codeInput"
            :maxlength="6"
          >
            <template #append>
              <Countdown
                v-model="counting"
                :expired="expired"
                :class="$style.countdown"
                @click="verifyPhone"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        :class="$style.next_btn"
        :loading-icon="Loading"
        :loading="submitting"
        @click="onSubmit"
      >
        下一步
      </el-button>
      <div v-show="captchaVisible" :class="$style.mask" />
      <Teleport to="body">
        <div v-show="captchaVisible" ref="captchaRef" :class="$style.captcha"></div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import AccountHeader from "@/client/components/AccountHeader.vue";
import getPhoneValidator from "@/sign/validators/getPhoneValidator";
import { checkPhoneCaptcha } from "@/client/api/user";
import Countdown from "@/sign/components/Countdown.vue";
import isValidPhone from "@/sign/validators/isValidPhone";
import { ArrowLeftBold, Loading } from "@element-plus/icons-vue";
import { optionType } from "@/client/components/types/component";
import { SlideCaptchaTrackData } from "#captcha";
import { getCaptcha, ResponseBody, sendPhoneCaptcha } from "@/sign/api/sign";
import Captcha from "../../../../../packages/captcha/src/captcha/CaptchaContext";
import { useRouter } from "vue-router";
const router = useRouter();
const formRef = ref<FormInstance>();
const captchaRef = ref<HTMLElement | null>(null);
const captchaVisible = ref(false);
const captchaSend = ref(false);
const submitting = ref<boolean>(false);
const slotOptions: optionType[] = [
  {
    className: "title",
    name: "title",
  },
];

type PhoneEditFormData = {
  phone: string;
  verifyCode: string;
};

const validateCaptcha = async (id: string, payload: SlideCaptchaTrackData) => {
  return await sendPhoneCaptcha(form.phone, id, payload, false).catch((res: ResponseBody<null>) => {
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

const form = reactive<PhoneEditFormData>({
  phone: "",
  verifyCode: "",
});
// 倒计时的过期时间
const expired = ref<number>(0);
// 是否正在倒计时中, 正在倒计时时, 也需要更新过期时间expired
const counting = ref(false);

const formRules = reactive<FormRules<PhoneEditFormData>>({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: getPhoneValidator("手机号不合法"), trigger: "blur" },
  ],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
const verifyPhone = () => {
  if (!form.phone || form.phone === "") {
    ElMessage.error("请先填写手机号");
    return;
  }
  if (!isValidPhone(form.phone)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  captchaValidate(startCountdown);
};
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
  submitting.value = true;
  const payload = {
    phone: form.phone,
    code: form.verifyCode,
  };
  const success = await checkPhoneCaptcha(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!success) return;
  router.push({
    name: "passwordSetting",
    params: { ...payload },
  });
};
</script>

<style lang="scss" module>
@use "src/styles/theme";
._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;
}
.wrap {
  padding: 0 15px;
  & > h3 {
    font-weight: 500;
    font-size: 18px;
    color: #333333;
    padding: 40px 0 20px;
    text-align: center;
  }
}
.cancel {
  font-weight: 400;
  font-size: 16px;
  color: #666666;
  position: absolute;
  left: 15px;
}
.confirm {
  font-weight: 400;
  font-size: 16px;
  color: #999999;
  position: absolute;
  right: 15px;
}

.phoneInput,
.codeInput {
  :global(.el-input__wrapper) {
    font-weight: 400;
    font-size: 16px;
    background: #ffffff;
    height: 42px;
    line-height: 42px;
    color: #999999;
    border: 1px solid #f4f2f2;
    padding-left: 12px;
    border-radius: 8px;
  }
}
.codeInput {
  :global(.el-input__wrapper) {
    padding-left: 18px;
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
.next_btn {
  width: 100%;
  max-width: 345px;
  height: 42px;
  background: #206cf1;
  border-radius: 8px;
  text-align: center;
  line-height: 42px;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  border: 0 none;
  box-shadow: none;
  outline: 0 none;
}
</style>
