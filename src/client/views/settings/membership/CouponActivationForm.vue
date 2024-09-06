<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="form"
    label-position="top"
    label-width="auto"
    :class="$style._"
    @keydown.enter.prevent="onSubmit"
  >
    <el-form-item label="兑换码" prop="couponCode">
      <el-input
        ref="inputRef"
        v-model="form.couponCode"
        placeholder="请输入卡片上的10位兑换码"
        maxlength="10"
        @input="onInputCouponCode"
      />
    </el-form-item>
    <p v-if="remoteMsg" :class="$style.error">{{ remoteMsg }}</p>
    <TermsCheckbox v-model="form.agreed" :class="$style.checkbox" />
  </el-form>
  <div :class="$style.bar">
    <el-button @click="endActivation">取消</el-button>
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
import { ref, reactive, onMounted, nextTick, useCssModule } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import TermsCheckbox from "./TermsCheckBox.vue";
import { activeMemberCoupon } from "@/client/api/user";
import { reloadMemberInfo } from "@/store/useMemberInfo";

const emit = defineEmits<{
  close: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);
const inputRef = ref<HTMLDivElement>();
const remoteMsg = ref<string | null>(null);

const $style = useCssModule();

type RedemptionForm = {
  couponCode: string;
  agreed?: boolean;
};

const form = reactive<RedemptionForm>({
  couponCode: "",
});

const formRules = reactive<FormRules<RedemptionForm>>({
  couponCode: [{ validator: getRequiredValidator("兑换码不能为空"), trigger: "submit" }],
});

const endActivation = () => emit("close");

const tipActivated = (message: string) => {
  ElMessage.success({
    message,
    showClose: true,
    customClass: $style.tips,
  });
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
  if (!form.agreed) {
    ElMessage.error("请阅读并同意《无涯会员服务协议》");
    return;
  }
  submitting.value = true;
  const { couponCode } = form;
  const response = await activeMemberCoupon({ couponCode, channel: 1 }).catch(console.error);
  submitting.value = false;
  if (!response) return;
  const { msg, status: activated } = response;
  if (activated) {
    tipActivated(msg);
    endActivation();
    await reloadMemberInfo().catch(console.error);
  } else {
    remoteMsg.value = msg;
  }
};

const onInputCouponCode = () => {
  const formInstance = formRef.value;
  if (!formInstance) return;
  remoteMsg.value = null;
  formInstance.clearValidate("couponCode");
};

onMounted(async () => {
  await nextTick();
  const input = inputRef.value;
  if (!input) return;
  input.focus();
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

$gap-button: 8px;

._ {
  margin: theme.$dialog-breath-vertical theme.$dialog-breath-horizontal;
}

.bar {
  border-top: 1px solid #e5eaf5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: theme.$dialog-breath-vertical theme.$dialog-breath-horizontal;
  gap: 8px;

  :global(.el-button) {
    min-width: 64px;
    margin: 0;
  }
}

.error {
  height: 16px;
  font-size: 12px;
  color: #fa465c;
  line-height: 16px;
  margin: -14px 0 -2px;
}

.tips {
  width: 580px;
  height: 40px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  --el-message-bg-color: #f6ffed;
  --el-message-border-color: #d9f7be;
  --el-message-text-color: rgba(0, 0, 0, 0.88);

  :global {
    .el-message__icon {
      color: #52c41a;
    }

    .el-message__content {
      margin-right: auto;
    }
  }
}
</style>
