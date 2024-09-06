<template>
  <OperationWrapper>
    <TranslateSelect :on-translate="onTranslate" />
  </OperationWrapper>
</template>
<script setup lang="ts">
import TranslateSelect from "@/client/views/intelligentQA/components/TranslateSelect.vue";
import OperationWrapper from "@/client/views/intelligentQA/components/OperationWrapper.vue";

const visible = defineModel<boolean>("visible");
const language = defineModel<string>("language");
const onTranslate = (value: string) => {
  visible.value = true;
  language.value = value;
};
</script>

<style module lang="scss"></style>
