<template>
  <FormContext v-slot="formContext">
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="form"
      label-position="top"
      label-width="auto"
      :class="[formContext.class, $style._]"
      @keydown.enter="onNext"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autofocus placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <PhoneVerifier v-model="form.verifyCode" :phone="form.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <template #label>
          <div :class="$style.label">
            <span>密码</span>
            <InlineHelp>密码至少8位，需至少包含大写字母、小写字母、数字及特殊字符中的3种</InlineHelp>
          </div>
        </template>
        <template #default>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </template>
      </el-form-item>
      <el-form-item label="密码确认" prop="passwordConfirm">
        <el-input v-model="form.passwordConfirm" type="password" placeholder="请确认密码" show-password />
      </el-form-item>
      <SignFooter v-slot="slotProps">
        <VisibleComFilter none>
          <TermsCheckbox
            v-model:checked="form.agreed"
            v-model:tip="tipAgreeTerms"
            predicate="我已阅读并同意"
            link-class="infinity-link_default"
          />
        </VisibleComFilter>

        <el-button
          type="primary"
          :loading-icon="Loading"
          :loading="submitting"
          :class="slotProps.class"
          @click="onNext"
          >确认并登录</el-button
        >
      </SignFooter>
    </el-form>
  </FormContext>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import SignFooter from "@/sign/components/SignFooter.vue";
import FormContext from "@/sign/components/FormContext.vue";
import TermsCheckbox from "@/sign/components/TermsCheckbox.vue";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import passwordQualityValidator from "@/sign/validators/passwordQualityValidator";
import PhoneVerifier from "@/sign/components/PhoneVerifier.vue";
import getPhoneValidator from "@/sign/validators/getPhoneValidator";
import InlineHelp from "@/sign/components/InlineHelp.vue";
import { createUser, ResponseBody, SignUpPayload } from "@/sign/api/sign";
import encrypt from "@/sign/utils/encrypt";
import redirectBack from "@/sign/redirectBack";
import { Loading } from "@element-plus/icons-vue";
import updateUserProfile from "@/sign/updateUserProfile";
import getSEMInfo from "@/utils/getSEMInfo";
import VisibleComFilter from "@/components/VisibleComFilter.vue";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

export type SignUpForm = {
  username: string;
  phone: string;
  verifyCode: string;
  agreed?: boolean;
  password: string;
  passwordConfirm: string;
};

const formRef = ref<FormInstance>();
const tipAgreeTerms = ref(false);
const submitting = ref<boolean>(false);
const route = useRoute();

const isTagQuery = omitRestQueryValue(route.query.tag) === "off";
const form = reactive<SignUpForm>({
  username: "",
  phone: "",
  verifyCode: "",
  password: "",
  passwordConfirm: "",
});

const passwordEqualValidator = (rule: unknown, password: string, callback: (message?: string) => void) => {
  if (password === form.password) {
    callback();
  } else {
    callback("两次密码不一致");
  }
};

const formRules = reactive<FormRules<SignUpForm>>({
  username: [{ validator: getRequiredValidator("用户名不能为空"), trigger: "blur" }],
  phone: [
    { validator: getRequiredValidator("手机号不能为空"), trigger: "blur" },
    { validator: getPhoneValidator("手机号不合法"), trigger: "blur" },
  ],
  verifyCode: [{ validator: getRequiredValidator("验证码不能为空"), trigger: "blur" }],
  password: [
    { validator: getRequiredValidator("密码不能为空"), trigger: "blur" },
    { validator: passwordQualityValidator, trigger: "blur" },
  ],
  passwordConfirm: [
    { validator: getRequiredValidator("密码确认不能为空"), trigger: "blur" },
    { validator: passwordQualityValidator, trigger: "blur" },
    { validator: passwordEqualValidator, trigger: "blur" },
  ],
});

const onNext = async () => {
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
  const payload: SignUpPayload = {
    username: form.username,
    password: encrypt(form.password),
    phone: form.phone,
    phoneCode: form.verifyCode,
    ...getSEMInfo(route.query.redirect),
  };
  const userProfile = await createUser(payload).catch((err: ResponseBody<null>) => {
    ElMessage.error(err);
  });
  submitting.value = false;
  if (!userProfile) return;
  ElMessage.success("注册成功");
  updateUserProfile(userProfile);
  await redirectBack().catch(console.error);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

button:global(.el-button).verifyBtn {
  border-color: #d6dae6;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 100%;
  position: relative;
  left: -1px;
  color: theme.$text-color-primary;
  background-color: white;

  &:hover {
    border-color: theme.$color-primary;
    color: theme.$color-primary;
    background-color: white;
  }
}

.label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
