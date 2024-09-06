<template>
  <el-popover
    :popper-class="$style._"
    placement="right"
    v-if="isTooltip"
    content="提示"
    :offset="-10"
    :show-arrow="false"
  >
    <div :class="$style.popover_menu" @click.prevent="moveAgent(item.key)">
      <MinusCircleIcon :class="$style.menu_icon" />
      <span :class="$style.btn_title">移除</span>
    </div>
    <template #reference>
      <slot :moveAgent="moveAgent"></slot>
    </template>
  </el-popover>
  <slot v-else :moveAgent="moveAgent"></slot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MinusCircleIcon from "@/client/icons/minus_circle.svg";
import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import { AgentItem, AideKey } from "@/client/const";

const props = defineProps<{
  menuClass: "cubed" | "tiled" | "none";
  item: AgentItem;
}>();

const { defaultAgentType, setDefaultAgentType } = useDefaultAgentType();
const isTooltip = computed(() => props.menuClass === "cubed");
const moveAgent = async (key: AideKey) => {
  const idx = defaultAgentType.value.indexOf(key);
  if (idx < 0) return;
  defaultAgentType.value.splice(idx, 1);
  await setDefaultAgentType(defaultAgentType.value);
};
</script>

<style module lang="scss">
.popover_menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  &:hover {
    background: #f1f2f7;
  }
}

._ {
  padding: 5px 0 !important;
}

.menu_icon {
  width: 18px;
  margin-right: 5px;
}
.btn_title {
  line-height: 18px;
}
</style>
