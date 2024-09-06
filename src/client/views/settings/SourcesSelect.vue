<template>
  <el-select
    v-model="displaySources"
    :class="[props.class, $style._]"
    multiple
    placeholder="请选择知识源"
    @change="reselectDisplaySources"
    @blur="confirmSourcesChange"
    @remove-tag="confirmSourcesChange"
  >
    <div :class="isMobile ? $style.dropdown_h5 : $style.dropdown">
      <el-option
        v-for="(item, index) in KNOWLEDGE_SOURCE"
        :key="index"
        :label="item.title"
        :value="item.type"
      >
        <SourceCard :class="$style.card" :is-active="displaySources?.includes(item.type)" :data="item" />
      </el-option>
    </div>
  </el-select>
</template>
<script lang="ts" setup>
import { KNOWLEDGE_SOURCE } from "@/client/const";
import SourceCard from "@/client/components/SourceCard.vue";
import { ref } from "vue";
import { isMobile } from "@/config";

const props = defineProps<{
  class?: string;
}>();
const model = defineModel<string[] | null>({ required: true });

const displaySources = ref(model.value);

const isAll = (source: string) => {
  return source === "all";
};

// 处理选项“全部”, 使选项列表变得优雅
const reselectSources = (selected: string[]): string[] => {
  const len = selected.length;
  // 空数组不作修改
  if (!len) return selected;
  // selected 数组中最后一项永远是最新修改的
  const last = selected[len - 1];
  // 如果选择了“全部”
  if (isAll(last)) {
    // 那么移除其它项
    return [last];
  } else {
    // 如果选择了“全部”外的其它项
    // 那么移除项“全部”
    return selected.filter((source) => !isAll(source));
  }
};

const reselectDisplaySources = (selected: string[]) => {
  displaySources.value = reselectSources(selected);
};

const confirmSourcesChange = () => {
  model.value = displaySources.value;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  :global {
    .el-tag {
      height: 22px;
      --el-color-info: theme.$text-color-primary;
    }
    .el-tag__close {
      &:hover {
        color: theme.$color-primary;
      }
    }
  }
}

.dropdown {
  width: 582px;
  height: 184px;
  display: flex;
  flex-wrap: wrap;
  padding: 0 8px;

  :global {
    .el-select-dropdown__item {
      height: unset;
      width: 180px;
      margin: 4px;
      padding: 0;
      text-wrap: wrap;
      border-radius: 6px;

      &::after {
        display: none;
      }
    }

    .el-select-dropdown__list {
      border-radius: 8px;
      padding: 0;
    }
  }
}

.card {
  height: 100%;
  box-sizing: border-box;
}

.dropdown_h5 {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0 8px;

  :global {
    .el-select-dropdown__item {
      height: unset;
      width: calc(50% - 12px);
      margin: 4px;
      padding: 0;
      text-wrap: wrap;
      border-radius: 6px;

      &::after {
        display: none;
      }
    }

    .el-select-dropdown__list {
      border-radius: 8px;
      padding: 0;
    }
  }
}
</style>
