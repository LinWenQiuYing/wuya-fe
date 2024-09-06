<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="form"
    label-position="top"
    label-width="auto"
    :class="$style._"
    @keydown.enter="onSubmit"
  >
    <el-tabs v-model="form.verifyType" stretch>
      <el-tab-pane label="手机号" name="phone" />
      <el-tab-pane label="邮箱" name="email" />
    </el-tabs>
    <el-form-item v-if="form.verifyType === 'phone'" label="手机号" prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item v-if="form.verifyType === 'email'" label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item label="验证码" prop="verifyCode">
      <PhoneVerifier
        v-if="form.verifyType === 'phone'"
        key="phone"
        v-model="form.verifyCode"
        :phone="form.phone"
        :phone-exist-required="true"
      />
      <EmailVerifier
        v-if="form.verifyType === 'email'"
        key="email"
        v-model="form.verifyCode"
        :email="form.email"
        :email-exist-required="true"
      />
    </el-form-item>
    <el-form-item prop="password">
      <template #label>
        <div :class="$style.label">
          <span>新密码</span>
          <InlineHelp>密码至少8位，需至少包含大写字母、小写字母、数字及特殊字符中的3种</InlineHelp>
        </div>
      </template>
      <template #default>
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </template>
    </el-form-item>
    <el-form-item label="新密码确认" prop="passwordConfirm">
      <el-input v-model="form.passwordConfirm" type="password" placeholder="请确认密码" show-password />
    </el-form-item>
    <SignFooter v-slot="slotProps">
      <TermsCheckbox
        v-model:checked="form.agreed"
        v-model:tip="tipAgreeTerms"
        predicate="我已阅读并同意"
        link-class="infinity-link_default"
      />
      <el-button
        type="primary"
        :class="slotProps.class"
        :loading-icon="Loading"
        :loading="submitting"
        @click="onSubmit"
        >确认并登录</el-button
      >
    </SignFooter>
  </el-form>
</template>
<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { AuthType, resetPassword } from "../api/sign";
import encrypt from "@/sign/utils/encrypt";
import PhoneVerifier from "@/sign/components/PhoneVerifier.vue";
import EmailVerifier from "@/sign/components/EmailVerifier.vue";
import TermsCheckbox from "@/sign/components/TermsCheckbox.vue";
import InlineHelp from "@/sign/components/InlineHelp.vue";
import SignFooter from "@/sign/components/SignFooter.vue";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import getPhoneValidator from "@/sign/validators/getPhoneValidator";
import passwordQualityValidator from "@/sign/validators/passwordQualityValidator";
import getEmailValidator from "@/sign/validators/getEmailValidator";
import redirectBack from "@/sign/redirectBack";
import updateUserProfile from "@/sign/updateUserProfile";

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);
const tipAgreeTerms = ref(false);

type PasswordResetFormData = {
  verifyType: "phone" | "email";
  phone: string;
  email: string;
  verifyCode: string;
  password: string;
  passwordConfirm: string;
  agreed?: boolean;
};

const form = reactive<PasswordResetFormData>({
  verifyType: "phone",
  phone: "",
  email: "",
  verifyCode: "",
  password: "",
  passwordConfirm: "",
});

const passwordEqualValidator = (rule: unknown, password: string, callback: (message?: string) => void) => {
  if (form.password === form.passwordConfirm) {
    callback();
  } else {
    callback("两次密码不一致");
  }
};

const isVerifyByPhone = () => form.verifyType === "phone";
const isVerifyByEmail = () => form.verifyType === "email";

const formRules = ref<FormRules<PasswordResetFormData>>({
  phone: [
    { validator: getRequiredValidator("手机号不能为空", { bypass: isVerifyByEmail }), trigger: "blur" },
    { validator: getPhoneValidator("手机号不合法", { bypass: isVerifyByEmail }), trigger: "blur" },
  ],
  email: [
    { validator: getRequiredValidator("邮箱不能为空", { bypass: isVerifyByPhone }), trigger: "blur" },
    { validator: getEmailValidator("邮箱不合法", { bypass: isVerifyByPhone }), trigger: "blur" },
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
  if (!form.agreed) {
    tipAgreeTerms.value = true;
    // ElMessage.warning("请勾选用户协议");
    return;
  }
  submitting.value = true;
  const byPhone = form.verifyType === "phone";
  const payload = {
    auth: byPhone ? form.phone : form.email,
    code: form.verifyCode,
    newPassword: encrypt(form.password),
    type: byPhone ? AuthType.Phone : AuthType.Email,
  };
  const userProfile = await resetPassword(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!userProfile) return;
  ElMessage.success("密码找回成功!");
  updateUserProfile(userProfile);
  await redirectBack().catch(console.error);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

.label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
