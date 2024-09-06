<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions">
      <template #back>
        <span :class="$style.cancel">取消</span>
      </template>
      <template #title> 设置密码 </template>
      <template #confirm>
        <span @click="onSubmit">确定</span>
      </template>
    </account-header>
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="form"
      label-position="top"
      label-width="auto"
      :class="$style.form"
    >
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="至少8位，需要同时有英文和数字"
          maxlength="64"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPasswordRepeat">
        <el-input
          v-model="form.newPasswordRepeat"
          type="password"
          placeholder="请再输入一次新密码"
          maxlength="64"
          show-password
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";
import AccountHeader from "@/client/components/AccountHeader.vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import encrypt from "@/sign/utils/encrypt";
import passwordQualityValidator from "@/sign/validators/passwordQualityValidator";
import updateUserProfile from "@/sign/updateUserProfile";
import { resetPassword } from "@/sign/api/sign";
import { optionType } from "@/client/components/types/component";
import { useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
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

type PasswordEditFormData = {
  newPassword: string;
  newPasswordRepeat: string;
};

const form = reactive<PasswordEditFormData>({
  newPassword: "",
  newPasswordRepeat: "",
});

const passwordEqualValidator = (rule: unknown, password: string, callback: (message?: string) => void) => {
  if (password === form.newPassword) {
    callback();
  } else {
    callback("两次密码不一致");
  }
};

const formRules = reactive<FormRules<PasswordEditFormData>>({
  newPassword: [
    { required: true, message: "至少8位，需要同时有英文和数字", trigger: "change" },
    { validator: passwordQualityValidator, trigger: "change" },
  ],
  newPasswordRepeat: [
    { required: true, message: "请在输入一次新密码", trigger: "change" },
    { validator: passwordQualityValidator, trigger: "change" },
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
  const { phone, code } = route.params;
  const payload = {
    newPassword: encrypt(form.newPassword),
    auth: phone,
    code: code,
    type: 1,
  };
  const userProfile = await resetPassword(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  if (!userProfile) return;
  ElMessage.success("密码设置成功!");
  updateUserProfile(userProfile);
  setTimeout(() => {
    router.go(-2);
  }, 1000);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

$gap-button: 8px;

._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;
}
.form {
  padding: 18px 15px 0;
}
.form {
  :global(.el-form-item__label) {
    font-weight: 400;
    font-size: 16px;
  }
  :global(.el-input__wrapper) {
    height: 42px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #f4f2f2;
  }
}
.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
