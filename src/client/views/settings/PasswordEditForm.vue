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
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        autofocus
        type="password"
        placeholder="请填写旧密码"
        maxlength="64"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        type="password"
        placeholder="至少8位，需要同时有英文和数字"
        maxlength="64"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPasswordRepeat">
      <el-input
        v-model="form.newPasswordRepeat"
        type="password"
        placeholder="请再输入一次新密码"
        maxlength="64"
        show-password
      />
    </el-form-item>
  </el-form>
  <div :class="$style.bar">
    <el-button @click="emit('finish')">取消</el-button>
    <el-button
      type="primary"
      :class="$style.submit"
      :loading-icon="Loading"
      :loading="submitting"
      @click="onSubmit"
    >
      确定
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { updatePassword } from "@/client/api/user";
import encrypt from "@/sign/utils/encrypt";
import passwordQualityValidator from "@/sign/validators/passwordQualityValidator";
import updateUserProfile from "@/sign/updateUserProfile";

const emit = defineEmits<{
  finish: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);

type PasswordEditFormData = {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
};

const form = reactive<PasswordEditFormData>({
  oldPassword: "",
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
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "change" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "change" },
    { validator: passwordQualityValidator, trigger: "change" },
  ],
  newPasswordRepeat: [
    { required: true, message: "请确认新密码", trigger: "change" },
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
  submitting.value = true;
  const payload = {
    oldPassword: encrypt(form.oldPassword),
    newPassword: encrypt(form.newPassword),
  };
  const userProfile = await updatePassword(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!userProfile) return;
  ElMessage.success("密码重置成功!");
  updateUserProfile(userProfile);
  emit("finish");
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

$gap-button: 8px;

._ {
  padding: theme.$dialog-breath-vertical theme.$dialog-breath-horizontal;
}

.bar {
  border-top: 1px solid #e5eaf5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: theme.$dialog-breath-vertical theme.$dialog-breath-horizontal;
}
</style>
