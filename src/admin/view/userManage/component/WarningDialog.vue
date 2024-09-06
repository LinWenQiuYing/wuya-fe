<template>
  <el-dialog
    v-model="dialogTableVisible"
    custom-class="warningDialog"
    :show-close="false"
    width="400"
    @close="closeDialogFn"
  >
    <div class="dialog-content">
      <div class="icon"><DeleteIcon /></div>
      <div class="title">
        <span>删除{{ type }}</span>
        <p v-if="Array.isArray(props.name)">确认删除{{ props.name.join("/") }}?</p>
        <p v-else>确认删除{{ props.name }}?</p>
      </div>
      <div class="btn">
        <el-button @click="closeDialogFn">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import DeleteIcon from "@/admin/icons/delete.svg";
const props = withDefaults(
  defineProps<{
    name: string;
    type: string;
  }>(),
  {
    name: "",
    type: "",
  },
);
const emits = defineEmits(["sendWarningCloseFn"]);
const dialogTableVisible = ref(true);

const submit = () => {
  dialogTableVisible.value = true;
  emits("sendWarningCloseFn", true);
};

const closeDialogFn = () => {
  dialogTableVisible.value = true;
  emits("sendWarningCloseFn", false);
};

watch(
  () => props.name,
  () => {
    console.log(props.name);
  },
  { immediate: true, deep: true },
);
</script>
<style lang="scss" scoped>
@import "src/styles/theme";
.dialog-content {
  display: flex;
  position: relative;
  height: 100px;
}
.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  background-color: rgb(243, 198, 198);

  svg {
    width: 28px;
    fill: red;
  }
}
.title {
  height: 40px;
  margin-left: 8px;
  span {
    font-size: 14px;
    color: #2d364d;
    line-height: 22px;
    font-weight: 700;
  }
  p {
    font-size: 12px;
    color: #6d7587;
    line-height: 20px;
    font-weight: 400;
  }
}
.btn {
  position: absolute;
  bottom: 0px;
  right: 0;
}
</style>

<style lang="scss">
@import "src/styles/theme";
.warningDialog .el-dialog__header {
  display: none !important;
}
.warningDialog {
  margin-top: 35vh !important;
}
</style>
