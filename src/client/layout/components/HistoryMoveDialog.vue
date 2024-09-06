<template>
  <el-dialog v-model="visible" align-center title="移动" width="400px" append-to-body>
    <el-form ref="moveFormRef" label-position="top" label-width="auto" :model="moveForm" :rules="moveRules">
      <el-form-item label="目标文件夹" prop="parent_id">
        <el-select v-model="moveForm.parent_id" placeholder="请选择" style="width: 380px">
          <el-option v-for="item in moveTree" :key="item.id" :label="item.title_name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="onMoveCancel">取消</el-button>
        <el-button type="primary" @click="onMoveOk(moveFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ChatTreeNode } from "@/client/types/api";
import { ElMessage, FormInstance } from "element-plus";
import { moveChat } from "@/client/api/history";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import store from "@/store";
import useHistoryType from "@/client/layout/useHistoryType";

const visible = defineModel<boolean>();
const props = defineProps<{ curNode?: ChatTreeNode }>();
const moveFormRef = ref();
const moveForm = reactive({
  parent_id: "",
});

const { getHistoryChats } = useGetHistoryChat();
const { curChat, moveTree } = useHistoryChat();
const chat_id = computed(() => store.state.chat.chat_id);
const type = useHistoryType();

const moveRules = {
  parent_id: [{ required: true, message: "目标文件夹不能为空", trigger: "change" }],
};

const onMoveCancel = () => {
  visible.value = false;
};
const onMoveOk = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await moveChat(props.curNode.id, moveForm.parent_id).catch(console.error);
      if (chat_id.value === props.curNode.id) {
        curChat.value = {
          ...props.curNode,
          parent_id: moveForm.parent_id,
        };
      }
      await getHistoryChats(type.value, 1, false).catch(console.error);
      ElMessage({ type: "success", message: "操作成功" });
      visible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style module lang="scss"></style>
