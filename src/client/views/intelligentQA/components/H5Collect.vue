<template>
  <div class="mobile-tools">
    <CollectIcon v-if="question" @click="visibleChange(true)" />
    <UncollectIcon v-else @click="visibleChange(true)" />
    <CollectDialog v-model="newFolderVisible" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import CollectIcon from "@/client/icons/collect.svg";
import UncollectIcon from "@/client/icons/uncollect.svg";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import CollectDialog from "./CollectDialog.vue";

const { curChat } = useHistoryChat();
const question = ref<string | undefined>(undefined);
const newFolderVisible = ref<boolean>(false);

const visibleChange = (visible: boolean) => {
  newFolderVisible.value = visible;
};

watch(
  () => curChat.value,
  (curChat) => {
    question.value = curChat?.title_name;
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.mobile-tools {
  color: $text-color-primary;

  svg {
    transform: scale(1.143);
  }
}
</style>
