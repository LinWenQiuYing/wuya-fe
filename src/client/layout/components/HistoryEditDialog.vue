<template>
  <el-dialog v-model="visible" append-to-body align-center title="编辑" width="400px">
    <el-form ref="formRef" label-position="top" label-width="auto" :model="form" :rules="rules">
      <el-form-item label="标题" prop="title_name">
        <el-input v-model="form.title_name" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="onEditCancel">取消</el-button>
        <el-button type="primary" @click="onEditOk(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElInput, ElMessage, FormInstance } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import { editChat } from "@/client/api/history";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import useHistoryType from "@/client/layout/useHistoryType";
import useHistoryChat from "@/store/hooks/useHistoryChat";
import store from "@/store";
import { ChatTreeNode } from "@/client/types/api";

interface Form {
  title_name: string;
}

const visible = defineModel<boolean>();
const props = defineProps<{ curNode?: ChatTreeNode }>();

const formRef = ref<FormInstance>();
const form = reactive<Form>({
  title_name: "",
});
const rules = {
  title_name: [{ required: true, message: "标题不能为空", trigger: "change" }],
};

const { getHistoryChats } = useGetHistoryChat();
const { curChat } = useHistoryChat();
const type = useHistoryType();
const chat_id = computed(() => store.state.chat.chat_id);

const onEditCancel = () => {
  visible.value = false;
};

const onEditOk = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await editChat(props.curNode.id, form.title_name).catch(console.error);
      if (props.curNode.id === chat_id.value) {
        curChat.value = {
          ...props.curNode,
          title_name: form.title_name,
        };
      }
      await getHistoryChats(type.value, 1, false).catch(console.error);
      visible.value = false;
      ElMessage({ type: "success", message: "操作成功" });
    } else {
      console.log("error submit!", fields);
    }
  });
};

watch(
  () => props.curNode,
  () => {
    form.title_name = props.curNode?.title_name ?? "";
  },
);
</script>

<style module lang="scss"></style>
