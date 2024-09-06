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
    <el-form-item label="新手机号" prop="phone">
      <el-input v-model="form.phone" placeholder="请填写新手机号" maxlength="11" />
    </el-form-item>
    <el-form-item label="验证码" prop="verifyCode">
      <PhoneVerifier v-model="form.verifyCode" :phone="form.phone" />
    </el-form-item>
  </el-form>
  <div :class="$style.bar">
    <el-button @click="emit('close')">取消</el-button>
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
import PhoneVerifier from "@/sign/components/PhoneVerifier.vue";
import getPhoneValidator from "@/sign/validators/getPhoneValidator";
import { updatePhone } from "@/client/api/user";
import updateUserProfile from "@/sign/updateUserProfile";

const emit = defineEmits<{
  close: [];
  next: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);

type PhoneEditFormData = {
  phone: string;
  verifyCode: string;
};

const form = reactive<PhoneEditFormData>({
  phone: "",
  verifyCode: "",
});

const formRules = reactive<FormRules<PhoneEditFormData>>({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: getPhoneValidator("手机号不合法"), trigger: "blur" },
  ],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
    phone: form.phone,
    code: form.verifyCode,
  };
  const userProfile = await updatePhone(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!userProfile) return;
  ElMessage.success("手机号修改成功");
  updateUserProfile(userProfile);
  emit("next");
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
