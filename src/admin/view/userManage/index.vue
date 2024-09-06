<template>
  <div v-if="state === Show_state.CHECK" :class="$style.user_warp">
    <el-tabs v-model="activeName" :class="$style.user_tab">
      <el-tab-pane v-for="(item, index) in Manage_title" :key="index" :name="item.key">
        <template #label>
          <div>{{ item.name }}</div>
        </template>

        <component
          :is="item.components"
          v-if="item.key === activeName"
          @change-state="changeState"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>

  <div v-else>
    <AddUser :edit-data="editData" @send-change-state="changeState" />
  </div>
</template>

<script setup lang="ts">
import { Show_state, UserManage_title } from "@/admin/types";
import { ref } from "vue";
import AddUser from "./AddUser.vue";
import { Manage_title } from "./const";

const activeName = ref(UserManage_title.ORGANIZATION);
const state = ref(Show_state.CHECK);
const editData = ref();

interface ChangeStateValue {
  status: Show_state;
  data?: any;
}

const changeState = (value: ChangeStateValue) => {
  const { status, data } = value;
  state.value = status;
  editData.value = data;
};
</script>

<style lang="scss" module>
@import "src/styles/mixins";

.user_tab {
  height: 100%;

  :global {
    .el-tabs__content {
      height: calc(100% - 40px);
    }

    @include margin-color();
  }
}

.user_warp {
  padding: 0 24px;
  height: 100%;
}
</style>
