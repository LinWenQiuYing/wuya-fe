<template>
  <div>
    <el-table
      :data="tableData"
      max-height="600px"
      :header-cell-style="{
        backgroundColor: '#f0f3fa',
      }"
      border
      row-key="id"
      :expand-row-keys="expandKeys"
      empty-text="暂无数据"
    >
      <el-table-column prop="name" label="部门" show-overflow-tooltip />
      <el-table-column label="查看文档/文档问答" prop="cat">
        <template #default="{ row }">
          <el-switch
            v-model="row.cat"
            active-text="开"
            inactive-text="关"
            inline-prompt
            @change="changeAuth(row, $event, 'cat')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="上传/解析文档" prop="upload">
        <template #default="{ row }">
          <el-switch
            v-model="row.upload"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="changeAuth(row, $event, 'upload')"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { OrganizationTree, TreeAuthList } from "@/admin/types";

import { getAllOrgTree } from "@/admin/api/userManage";
import { selectOrgTree } from "@/admin/utils/transformList";
import store from "@/store";
import { setKnowAuth } from "@/admin/api/auth";
import useDebounce from "@/hooks/useDebounce";

const tableData = ref<TreeAuthList[]>([]);
const expandKeys = ref<string[]>([]);
const props = defineProps<{
  isChangeRequest: boolean;
}>();

const currentKnow = computed(() => store.state.knowledge.currentData);
const getList = async () => {
  const treeRes = await getAllOrgTree(currentKnow.value.id);
  tableData.value = setTreeCatOrUpload(selectOrgTree(treeRes.data));
  if (!expandKeys.value.length) {
    expandKeys.value = tableData.value.map((d) => d.id + "");
  }
};

const setTreeCatOrUpload = (data: OrganizationTree[]): TreeAuthList[] => {
  return data.map((d) => {
    const res: TreeAuthList = { ...d, cat: false, upload: false };
    res.cat = d.permissionIds.includes(3);
    res.upload = d.permissionIds.includes(4);
    if (d.children?.length) {
      res.children = setTreeCatOrUpload(d.children);
    }
    return res;
  });
};

const setAuths = useDebounce(setKnowAuth, 1000);

const changeAuth = async (row: TreeAuthList, val: boolean, key: "cat" | "upload") => {
  if (row.children?.length) {
    updateChildCatOrUpload(row.children, key, val);
    if (!expandKeys.value.includes(row.id + "")) {
      expandKeys.value.push(row.id + "");
    }
  }
  if (props.isChangeRequest) {
    const paramArr = getParams();

    setAuths(currentKnow.value.id, paramArr)
      .catch(() => {
        row[key] = !val;
      })
      .finally(() => {
        getList();
      });
  }
};

const updateChildCatOrUpload = (data: TreeAuthList[], key: "cat" | "upload", val: boolean) => {
  data.forEach((d) => {
    d[key] = val;
    if (d.children?.length) updateChildCatOrUpload(d.children, key, val);
  });
};

const getParams = () => {
  return getAllCatAndUpload(tableData.value);
};

const getAllCatAndUpload = (data: TreeAuthList[], res: { organId: number; permissionId: number }[] = []) => {
  data.forEach((d) => {
    if (d.cat) {
      res.push({
        organId: d.id,
        permissionId: 3,
      });
    }
    if (d.upload) {
      res.push({
        organId: d.id,
        permissionId: 4,
      });
    }

    if (d.children) getAllCatAndUpload(d.children, res);
  });

  return res;
};

defineExpose({
  tableData: getParams,
});

onMounted(() => {
  getList();
});
</script>
