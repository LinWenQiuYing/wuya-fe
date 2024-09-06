<template>
  <el-dialog v-model="dialogTableVisible" :before-close="closeDialogFn" title="移动" width="800">
    <el-form ref="formRef" style="max-width: 500px" :model="state" label-width="100px">
      <el-form-item
        :rules="[
          {
            required: true,
            message: '请选择机构',
            trigger: 'blur',
          },
        ]"
        label="上级机构"
        prop="targetOrg"
      >
        <div class="treeSelectCom">
          <WTreeSelect :organ-id="state.targetOrg" @send-current-org-id="getCurrentOrgId" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialogFn">取消</el-button>
        <el-button type="primary" @click="submitFn(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import WTreeSelect from "./WTreeSelect.vue";
import { moveOrgan } from "@/admin/api/userManage";
const emits = defineEmits(["sendCloseFn"]);
const dialogTableVisible = ref(true);
// 被选中的用户id和组织id
const props = defineProps<{
  organId: number;
}>();
const formRef = ref();
const state = reactive({
  targetOrg: props.organId,
});

const closeDialogFn = () => {
  dialogTableVisible.value = true;
  emits("sendCloseFn", false);
};

const submitFn = async (formEl) => {
  if (!formEl) return;
  await formEl.validate();
  const params = {
    id: props.organId,
    parentId: state.targetOrg,
  };
  moveOrgan(params)
    .then(() => {
      ElMessage.success("移动成功");
    })
    .catch(() => {
      ElMessage.error("移动失败");
    })
    .finally(() => {
      dialogTableVisible.value = true;
      emits("sendCloseFn", true);
    });
};

// 获取机构id
const getCurrentOrgId = (id) => {
  state.targetOrg = id;
};
</script>

<style scoped>
.treeSelectCom {
  width: 100%;
  height: 100%;
}
</style>
