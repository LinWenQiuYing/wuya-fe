<template>
  <SignHeader :title="t('欢迎登录')">
    <AggressiveLink path="/sign">{{ t("切换验证码登录") }}</AggressiveLink>
  </SignHeader>
  <FormContext v-slot="formContext">
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="form"
      label-position="top"
      label-width="auto"
      :class="formContext.class"
      @keydown.enter="onSubmit"
    >
      <el-form-item :label="t('手机号/用户名/邮箱')" prop="username">
        <el-input v-model="form.username" autofocus :placeholder="t('手机号/用户名/邮箱')" />
      </el-form-item>
      <el-form-item prop="password">
        <slot name="label">
          <div :class="$style.pwdBar">
            <span>{{ t("密码") }}</span>
            <router-link
              :to="{ path: '/sign/forget', query: $route.query }"
              :class="$style.reset"
              tabindex="-1"
              >{{ t("忘记密码？") }}
            </router-link>
          </div>
        </slot>
        <slot name="default">
          <el-input v-model="form.password" type="password" :placeholder="t('请输入密码')" show-password />
        </slot>
      </el-form-item>
      <SignFooter v-slot="slotProps">
        <VisibleComFilter none>
          <TermsCheckbox
            v-model:checked="form.agreed"
            v-model:tip="tipAgreeTerms"
            :predicate="t('我已阅读并同意')"
            link-class="infinity-link_default"
          />
        </VisibleComFilter>

        <Teleport to="body">
          <div v-show="captchaVisible" ref="nodeRef" :class="$style.captcha"></div>
        </Teleport>
        <el-button
          type="primary"
          :loading-icon="Loading"
          :loading="submitting"
          :class="[slotProps.class, slotProps.spacing]"
          @click="onSubmit"
        >
          {{ t("登录") }}
        </el-button>
      </SignFooter>
    </el-form>
  </FormContext>
  <div :class="$style.signUpTips">
    <span>{{ t("还没有账号？") }}</span>
    <!--    <a class="infinity-link_default" @click="contactUsVisible = true">联系我们</a>-->
    <router-link :to="{ ...$route, path: '/sign/up' }" class="infinity-link_default"
      >{{ t("注册账号") }}
    </router-link>
  </div>
  <!--  TODO 暂时去除联系我们-->
  <!--  <ContactUsDialog v-model="contactUsVisible">-->
  <!--    <ContactUsFormSign @next="closeRegister" />-->
  <!--  </ContactUsDialog>-->
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { AuthInfo, getCaptcha, ResponseBody, UserInfo, validateCertification } from "@/sign/api/sign";
import { Loading } from "@element-plus/icons-vue";
import redirectBack from "../redirectBack";
import TermsCheckbox from "@/sign/components/TermsCheckbox.vue";
import SignHeader from "@/sign/components/SignHeader.vue";
import SignFooter from "@/sign/components/SignFooter.vue";
import FormContext from "@/sign/components/FormContext.vue";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import Captcha, { SlideCaptchaTrackData } from "#captcha";
import encrypt from "@/sign/utils/encrypt";
import updateUserProfile from "@/sign/updateUserProfile";
import AggressiveLink from "@/sign/components/AggressiveLink.vue";
// import ContactUsDialog from "@/client/views/settings/ContactUsDialog.vue";
// import ContactUsFormSign from "@/client/views/settings/ContactUsFormSign.vue";
import useI18n from "../locales";
import VisibleComFilter from "@/components/VisibleComFilter.vue";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import { useRoute } from "vue-router";
import { isMiniProgram, reLaunchHome } from "@/utils/wxUtils";

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);

const nodeRef = ref<HTMLDivElement | null>(null);
const captchaVisible = ref(false);
const route = useRoute();
// 是否启用推荐
const isTagQuery = omitRestQueryValue(route.query.tag) === "off";
// const contactUsVisible = ref<boolean>(false);
const tipAgreeTerms = ref(false);
const { t } = useI18n();
type SignInForm = {
  username: string;
  password: string;
  agreed?: boolean;
};

const form = reactive<SignInForm>({
  username: "",
  password: "",
});

const formRules = reactive<FormRules<SignInForm>>({
  username: [{ validator: getRequiredValidator("手机号/用户名/邮箱不能为空"), trigger: "blur" }],
  password: [{ validator: getRequiredValidator("密码不能为空"), trigger: "blur" }],
});

const validateCaptcha = async (key: string, code: SlideCaptchaTrackData) => {
  return await validateCertification({
    key,
    code,
    name: form.username,
    password: encrypt(form.password),
  }).catch((res: ResponseBody<null>) => {
    if (res.code !== 412) {
      submitting.value = false;
      ElMessage.error(res?.message);
    }
    return Promise.reject(res);
  });
};

const captchaValidate = (): void => {
  new Captcha({
    container: nodeRef.value!,
    getCaptcha,
    validateCaptcha,
    // 验证成功回调函数(必选项,必须配置)
    onValidateSuccess: async (captcha, userProfile: UserInfo & AuthInfo) => {
      // 销毁验证码服务
      captcha.destroyWindow();
      submitting.value = false;
      captchaVisible.value = false;
      updateUserProfile(userProfile);
      if (isMiniProgram.value) {
        reLaunchHome(String(route.query?.redirect || ""));
      } else {
        await redirectBack().catch(console.error);
      }
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
      submitting.value = false;
    },
  });
};

// const closeRegister = () => {
//   contactUsVisible.value = false;
// };

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
  if (!isTagQuery && !form.agreed) {
    tipAgreeTerms.value = true;
    return;
  }
  submitting.value = true;
  captchaVisible.value = true;
  if (!nodeRef.value) return;
  captchaValidate();
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

.pwdBar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reset {
  font-size: 12px;
  color: #6d7588;

  &:hover {
    text-decoration: underline;
    color: theme.$color-primary;
  }
}

.signUpTips {
  border-top: 1px solid #e0e4f1;
  padding-top: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6d7588;
  line-height: 20px;
  margin-top: 60px;
}

.captcha {
  width: 360px;
  height: 430px;
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
