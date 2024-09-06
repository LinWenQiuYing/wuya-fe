<template>
  <div>
    <el-form ref="form" label-width="100px" require-asterisk-position="right" :model="formData">
      <el-form-item
        label="知识库名称"
        prop="name"
        :rules="[
          {
            required: true,
            message: '请输入知识库名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="formData.name" class="base_input" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" :rows="2" style="max-width: 432px" type="textarea" />
      </el-form-item>
      <el-form-item
        label="知识库类型"
        prop="repositoryType"
        :rules="[
          {
            required: true,
            message: '请输入知识库类型',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="formData.repositoryType">
          <el-radio :value="1">文档</el-radio>
          <el-radio :value="2">图谱</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formData.repositoryType === 2">
        <el-form-item
          label="图谱英文名"
          prop="graphEnName"
          :rules="[
            {
              required: true,
              message: '请输入图谱英文名',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="formData.graphEnName" class="base_input" />
        </el-form-item>
        <el-form-item label="选择标签组" prop="tagGroupId">
          <el-select v-model="formData.tagGroupId" placeholder="请选择图谱标签组" style="max-width: 432px">
            <el-option v-for="item in tagsList" :key="item.id" :label="item.groupName" :value="item.id" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { getTagsList } from "@/admin/api/knowledge";
import { GrapSelectListProp } from "@/admin/types";
import { reactive, ref, watch } from "vue";
import store from "@/store";

const form = ref();

const formData = reactive({
  name: "",
  description: "",
  repositoryType: store.state.knowledge.createType,
  graphEnName: "",
  tagGroupId: "",
});
const tagsList = ref<GrapSelectListProp[]>();
const getTagsSelectList = async () => {
  const res = await getTagsList();
  tagsList.value = res.data;
};

watch(
  () => formData.repositoryType,
  (val) => {
    store.commit("knowledge/SET_CREATE_TYPE", val);
    if (!tagsList.value) {
      getTagsSelectList();
    }
  },
  {
    immediate: true,
  },
);

defineExpose({
  form,
  formData,
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
.base_input {
  max-width: 432px;
  border-radius: $border-radius-md;
}

.login_box {
  display: flex;
  width: 100%;
  .link {
    width: 50px;
    margin-left: 10px;
  }
}
</style>

<style scoped>
:deep(.base_input .el-input__inner) {
  border-radius: 0;
}
</style>
