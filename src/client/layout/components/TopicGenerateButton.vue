<template>
  <div>
    <div :class="$style.chat_input" @click="showInputDialog">
      <span>{{ `新话题（${shortcutKey}）` }}</span>
      <CirclePlus :class="$style.add_icon" />
    </div>
    <el-dialog v-model="inputDialogVisible" align-center append-to-body :class="$style.chat_input_modal">
      <ChatInputBox input-id="newChatInput" :is-agent="showAgent" @send="createTopic" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus } from "@element-plus/icons-vue";
import ChatInputBox from "@/client/components/ChatInputBox.vue";
import { computed, ref } from "vue";
import { tinykeys } from "tinykeys";
import { useRoute } from "vue-router";
import createChatTopic from "@/client/hooks/createChatTopic";
import createWriteTopic from "@/client/hooks/createWriteTopic";
import createSurveyTopic from "@/client/hooks/createSurveyTopic";
import createDataAnalysis from "@/client/hooks/createDataAnalysis";
import useDrawer from "@/client/hooks/useDrawer";
import createAuditChat from "@/client/hooks/createAuditChat";
import createParserChat from "@/client/views/video/createParserChat";
import createServiceChat from "@/client/views/customerService/createServiceChat";
import { isMacOS } from "@/config";
import createFinancialReport from "@/client/hooks/createFinancialReport";

const inputDialogVisible = ref(false);
const route = useRoute();
const { showDrawer, closeDrawer } = useDrawer();
const showAgent = computed(() => {
  return route.path.startsWith("/qa") || route.path.startsWith("/new");
});
const showInputDialog = () => {
  inputDialogVisible.value = true;
};
const closeInputDialog = () => {
  inputDialogVisible.value = false;
};

const shortcutKey = isMacOS ? "⌘ + ⇧ + K" : "Ctrl + Shift + K";

const createTopic = async (question: string, options?: { rule?: string }) => {
  closeInputDialog();
  if (showDrawer.value) closeDrawer();
  const inWrite = route.path.startsWith("/writing");
  const inSurvey = route.path.startsWith("/survey");
  const isDataAnalysis = route.path.startsWith("/dataAnalysis");
  const inContract = route.path.startsWith("/contract");
  const inParser = route.path.startsWith("/parser");
  const inService = route.path.startsWith("/customer_service");
  const isFinancial = route.path.startsWith("/financialAnalysis");
  if (inWrite) {
    await createWriteTopic(question);
  } else if (inSurvey) {
    await createSurveyTopic(question, options);
  } else if (isDataAnalysis) {
    await createDataAnalysis(question);
  } else if (inContract) {
    await createAuditChat(question, options);
  } else if (inParser) {
    await createParserChat(question);
  } else if (inService) {
    await createServiceChat(question);
  } else if (isFinancial) {
    await createFinancialReport(question);
  } else {
    await createChatTopic(question, options);
  }
};

tinykeys(window, {
  "$mod+Shift+K": () => {
    inputDialogVisible.value = true;
  },
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

.chat_input {
  height: 40px;
  padding: theme.$padding-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: theme.$color-white;
  color: theme.$text-color-secondary;
  font-size: theme.$font-size-base;
  border: 1px solid rgba(45, 54, 77, 1);
  box-shadow: 0 0 0 2px rgba(214, 218, 230, 1);
  border-radius: 20px;
  cursor: pointer;

  .add_icon {
    color: theme.$text-color-primary;
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: theme.$color-primary;
  }
}

.chat_input_modal {
  border-radius: theme.$border-radius-xl;

  :global {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      border-radius: theme.$border-radius-xl;
    }
  }
}
</style>
