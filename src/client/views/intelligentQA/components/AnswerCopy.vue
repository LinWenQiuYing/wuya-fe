<template>
  <OperationWrapper title="复制" @click="copyAnswer">
    <CopyIcon />
  </OperationWrapper>
</template>
<script setup lang="ts">
import CopyIcon from "@/client/icons/copy.svg";
import { useRoute } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import { formatReference } from "@/client/views/intelligentQA/utils";
import { ElMessage } from "element-plus";
import OperationWrapper from "@/client/views/intelligentQA/components/OperationWrapper.vue";

const props = defineProps<{
  contentRef: HTMLDivElement;
  reference?: Record<string, string>[];
}>();

const route = useRoute();
const inTag = omitRestQueryValue(route.query.tag) === "off";
const formatAnswer = (data: string) => {
  let result = data.replace(/\b\d+。/g, "。");
  const advertising = inTag ? "" : "\n\n以上回答由星环科技的无涯大模型生成 https://wuya-ai.com";
  const reference = formatReference(props.reference || []);
  result = result + `\n\n 参考:\n${reference}` + advertising;
  return result;
};
// 复制答案
const copyAnswer = () => {
  const answerElement = props.contentRef;
  if (answerElement) {
    const textarea = document.createElement("textarea");
    const text = formatAnswer(answerElement.innerText);
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    ElMessage({ type: "success", message: "复制成功" });
  }
};
</script>
<style module lang="scss"></style>
