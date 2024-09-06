<template>
  <div :class="$style.cardList">
    <div :class="$style.add_btn" @click="createKnow">
      <CirclePlus :class="$style.circle_icon" />
    </div>
    <el-tabs v-model="activeName" :class="$style.tabs" @tab-change="tabChange">
      <el-tab-pane v-for="(item, i) in knowledgeLeftComponent" :key="i" :label="item.label" :name="item.key">
        <el-input v-model="search" :class="$style.input" :suffix-icon="Search" placeholder="请输入关键词" />
        <div
          :class="$style.folder_wrapper"
          :style="{
            marginLeft: item.key === 'knowledge' ? '-15px' : 0,
          }"
        >
          <component
            :is="item.component"
            v-if="item.key === activeName"
            :search="search"
            @change-type="emit('change-type', 'list')"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { CirclePlus, Search } from "@element-plus/icons-vue";
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import { knowledgeLeftComponent } from "@/admin/view/knowledgeBase/const";

const search = ref("");
const emit = defineEmits(["change-type", "changeCurrentProjectId"]);

const router = useRouter();
const activeName = ref("knowledge");

const createKnow = async () => {
  await router.push("/admin/knowledge/createKnowledge");
};

const tabChange = () => {
  search.value = "";
  if (activeName.value === "knowledge") {
    store.commit("knowledge/SET_ORGANIZATION", null);
    emit("change-type", "table");
  } else {
    emit("change-type", "list");
  }
};

onBeforeUnmount(() => {
  store.commit("knowledge/SET_ORGANIZATION", null);
});
</script>
<style lang="scss" module>
@use "src/styles/theme";
@import "src/styles/mixins";

.tabs {
  //line-height: 24px;
  //font-weight: 700;

  :global {
    @include margin-color();
  }
}

.cardList {
  height: 100%;
  position: relative;

  :global {
    .input .el-input__inner {
      border-radius: 0;
    }

    .el-tabs__nav-wrap::after {
      background-color: inherit;
    }
  }

  .add_btn {
    position: absolute;
    top: 12px;
    right: 0;
    z-index: 10;

    &:hover {
      color: theme.$blue_color;
    }
  }

  .input {
    height: 30px;
    margin: 8px auto 6px;
    border-radius: theme.$border-radius-md;
  }
}

.folder_tree {
  height: 100%;
  background: none;
  --el-tree-node-content-height: 30px;
  --el-color-primary-light-9: rgba(8, 109, 244, 0.15);
}

.tree_label_name {
  flex: 1;
  height: 100%;
  line-height: 30px;
  color: #2d364d;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.circle_icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.folder_wrapper {
  margin-top: 6px;
  height: calc(100vh - 190px);
  overflow: auto;
}

.folder_icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.tree_label_warp {
  width: calc(100% - 31px);
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    .dropdown_warp {
      visibility: visible;
    }
  }
}

.label_more {
  transform: rotate(90deg);
  font-size: 14px;
  font-weight: 700;
}

.dropdown_warp {
  visibility: hidden;
}

.dropdown_btn {
  display: inline-block;
  line-height: 18px;
  height: 18px;
  padding: 0 12px;

  &:hover {
    cursor: pointer;
    background: #ecf5ff;
    color: theme.$blue_color;
  }
}
</style>
