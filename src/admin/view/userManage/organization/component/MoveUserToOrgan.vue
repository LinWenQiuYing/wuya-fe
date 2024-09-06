<template>
  <el-dialog v-model="dialogTableVisible" :before-close="closeDialogFn" title="移动用户" width="800">
    <el-form ref="formRef" style="max-width: 500px" :model="state" label-width="100px">
      <el-form-item prop="targetOrg" label="目标机构">
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
import WTreeSelect from "../../component/WTreeSelect.vue";
import { moveUsersToOrg } from "@/admin/api/userManage";
import { ElForm, ElMessage } from "element-plus";

const emits = defineEmits(["sendCloseFn"]);
const dialogTableVisible = ref(true);
// 被选中的用户id和组织id
const props = defineProps<{
  organId: number;
  userIds: number[];
}>();
const formRef = ref<InstanceType<typeof ElForm>>();
const state = reactive({
  targetOrg: props.organId,
});

const closeDialogFn = () => {
  dialogTableVisible.value = true;
  emits("sendCloseFn", false);
};

const submitFn = async (formEl: InstanceType<typeof ElForm>) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      moveUsersToOrg(state.targetOrg, props.userIds)
        .then(() => {
          ElMessage.success("移动成功");
        })
        .catch(() => {
          ElMessage.error("移动失败");
        });
      emits("sendCloseFn", true);
    } else {
      console.log("error submit!", fields);
    }
  });
  // dialogTableVisible.value = true
  // emits("sendCloseFn", true)
};

// 获取机构id
const getCurrentOrgId = (id: number) => {
  state.targetOrg = id;
};
</script>

<style scoped>
.treeSelectCom {
  width: 100%;
  height: 100%;
}
</style>
