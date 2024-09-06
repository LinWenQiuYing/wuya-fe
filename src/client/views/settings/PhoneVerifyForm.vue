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
    <el-form-item prop="verifyCode">
      <template #label>
        <span v-if="sent">验证码已发送到手机号{{ props.phone }}</span>
      </template>
      <template #default>
        <PhoneVerifier
          v-model="form.verifyCode"
          :phone="props.phone"
          :disable-toast-sent="true"
          :disable-validate-phone="true"
          @sent="onSent"
        />
      </template>
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
      下一步
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import PhoneVerifier from "@/sign/components/PhoneVerifier.vue";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import { checkPhoneCaptcha } from "@/client/api/user";

const props = defineProps<{
  phone: string;
}>();

const emit = defineEmits<{
  next: [code: number | string];
  close: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);
const sent = ref<boolean>(false);

type PhoneVerifyFormData = {
  verifyCode: string;
};

const form = reactive<PhoneVerifyFormData>({
  verifyCode: "",
});

const formRules = reactive<FormRules<PhoneVerifyFormData>>({
  verifyCode: [{ validator: getRequiredValidator("验证码不能为空"), trigger: "blur" }],
});

const onSent = () => {
  sent.value = true;
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
    phone: props.phone,
    code: form.verifyCode,
  };
  const success = await checkPhoneCaptcha(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!success) return;
  emit("next", form.verifyCode);
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
