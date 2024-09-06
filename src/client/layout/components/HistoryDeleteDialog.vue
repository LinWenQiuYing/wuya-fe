<template>
  <el-dialog v-model="visible" append-to-body align-center title="删除" width="400px">
    <div style="display: flex">
      <WarningFilled style="height: 20px" />
      <span style="padding-left: 5px; line-height: 22px">确定要删除该历史收藏或文件夹吗? </span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onDeleteCancel">取消</el-button>
        <el-button type="primary" @click="onDeleteOk(props.curNode.id)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { WarningFilled } from "@element-plus/icons-vue";
import { ChatTreeNode } from "@/client/types/api";
import store from "@/store";
import { deleteChat } from "@/client/api/history";
import { ElMessage } from "element-plus";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import { useRouter } from "vue-router";
import useHistoryType from "@/client/layout/useHistoryType";
import { HistoryChatType } from "@/client/types";

const ChatRoute = new Map([
  [HistoryChatType.intelligent_qa, "/qa"],
  [HistoryChatType.real_time_information, "/news"],
  [HistoryChatType.writing_assistant, "/writing"],
]);
const visible = defineModel<boolean>();
const props = defineProps<{ curNode?: ChatTreeNode }>();

const { getHistoryChats } = useGetHistoryChat();
const router = useRouter();
const type = useHistoryType();

const onDeleteCancel = () => {
  visible.value = false;
};

const onDeleteOk = async (topic_id: number) => {
  visible.value = false;
  const topicId = store.state.chat.chat_id;
  await deleteChat(topic_id).catch(console.error);
  await getHistoryChats(type.value, 1, false).catch(console.error);
  if (topic_id === topicId) {
    const route = ChatRoute.get(type.value) || "/qa";
    if (route === "/qa") store.commit("chat/SET_QUESTION", "");
    await router.push(route);
  }
  ElMessage({ type: "success", message: "操作成功" });
};
</script>

<style module lang="scss"></style>
