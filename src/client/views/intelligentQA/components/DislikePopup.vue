<template>
  <el-popover
    :visible="visible"
    title="反馈帮助无涯进步"
    :width="390"
    :show-arrow="false"
    :offset="2"
    :popper-class="$style.popup"
  >
    <template #default>
      <div ref="nodeRef">
        <Close :class="$style.close" title="关闭" @click="onClose" />
        <el-form ref="formRef" :model="form" :class="$style.form" :rules="rules">
          <el-form-item prop="feedbackType">
            <feedback-select v-model="form.feedbackType" />
          </el-form-item>
          <el-form-item v-if="form.feedbackType === '其他'" prop="feedbackText">
            <el-input v-model="form.feedbackText" placeholder="（可选）请填写反馈" />
          </el-form-item>
        </el-form>
        <el-divider :class="$style.divider" />
        <div :class="$style.footer">
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </div>
    </template>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import FeedbackSelect from "./FeedbackSelect.vue";
import { Close } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import { FeedBackType } from "@/client/types";
import useOutSide from "@/client/hooks/useOutSide";

const props = defineProps<{
  text: string | undefined;
}>();

const emit = defineEmits(["submit"]);

interface FeedbackForm {
  feedbackType: FeedBackType;
  feedbackText: string;
}

const form = reactive<FeedbackForm>({
  feedbackType: undefined,
  feedbackText: undefined,
});
const rules = reactive<FormRules<FeedbackForm>>({
  feedbackType: [{ validator: getRequiredValidator("反馈类型未选择"), trigger: "change" }],
});
const submitForm = async () => {
  const formInstance = formRef.value;
  if (!formInstance) return console.warn("找不到form实例");
  const valid = await formInstance.validate().catch(console.log);
  if (!valid) return console.warn("表单未通过校验");
  const comment = form.feedbackType === "其他" ? (form.feedbackText ?? "其他") : form.feedbackType;
  emit("submit", comment);
};

const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const { nodeRef } = useOutSide(() => (visible.value = false));
onMounted(() => {
  if (props.text) {
    form.feedbackText = props.text === "其他" ? undefined : props.text;
    const isDefault = [
      "格式错误",
      "逻辑错误",
      "有害信息",
      "事实错误",
      "没有帮助",
      "答非所问",
      "其他",
    ].includes(props.text);
    form.feedbackType = isDefault ? props.text : "其他";
  }
});

onBeforeUnmount(() => {
  if (!formRef.value) return;
  formRef.value.resetFields();
});

const onClose = () => {
  visible.value = false;
};
</script>
<style module lang="scss">
@use "src/styles/theme";

.popup {
  padding: 0 !important;

  :global {
    .el-popover__title {
      padding: 24px theme.$padding-md theme.$padding-md;
      font-weight: bold;
      font-size: theme.$font-size-lg;
      color: theme.$text-color-primary;
      margin-bottom: 0;
    }
  }
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  width: 18px;
  height: 18px;
}

.divider {
  margin-bottom: theme.$margin-sm;
}

.footer {
  display: flex;
  padding: 0 theme.$margin-md theme.$padding-sm theme.$margin-md;
  justify-content: flex-end;
}

.form {
  width: 100%;
  padding: 0 theme.$padding-md;
}
</style>
