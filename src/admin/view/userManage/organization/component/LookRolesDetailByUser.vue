<template>
  <el-dialog v-model="dialogTableVisible" :before-close="closeDialogFn" title="角色信息" width="800">
    <el-table :data="tableData" border height="40vh">
      <el-table-column label="角色名称" property="name" />
      <el-table-column label="描述" property="description" />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeDialogFn">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const emits = defineEmits(["sendCloseFn"]);
const dialogTableVisible = ref(true);
import { getUserDetail } from "@/admin/api/userManage";

const props = defineProps<{
  userId: number;
}>();
import { watch } from "vue";

const tableData = ref([]);

const closeDialogFn = () => {
  dialogTableVisible.value = true;
  emits("sendCloseFn", false);
};

// 查询该用户角色信息
const getRolesDetailByUserId = async (id: number) => {
  const res = await getUserDetail(id);
  tableData.value = res.data.roles;
};

watch(
  () => props.userId,
  (id) => {
    getRolesDetailByUserId(id);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.search {
  width: 100%;
  text-align: right;
}
</style>
