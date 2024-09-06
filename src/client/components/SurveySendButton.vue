<template>
  <div :class="$style._">
    <el-link :icon="MindMappingIcon" :class="$style.outline_btn" :underline="false" @click="editOutline">
      设置大纲
    </el-link>
    <MemberCountPopover :type="SvcTypeEnum.DILIGENCE">
      <template #default="{ disabled }">
        <el-button :disabled="disabled || props.disabled" round :class="$style.send" @click="send">
          请分析<AirplaneIcon />
        </el-button>
      </template>
    </MemberCountPopover>
  </div>
  <OutlineBeforeSend v-model="visible" :click-send="setOutline" />
</template>

<script setup lang="ts">
import AirplaneIcon from "@/client/icons/airplane.svg";
import MindMappingIcon from "@/client/icons/mind-mapping.svg";
import { ref } from "vue";
import OutlineBeforeSend from "@/client/views/survey/components/OutlineBeforeSend.vue";
import MemberCountPopover from "@/client/components/MemberCountPopover.vue";
import { SvcTypeEnum } from "@/client/api/user";

const props = defineProps<{
  disabled: boolean;
  send: (template?: string) => void;
}>();
const visible = ref<boolean>(false);
const outline = ref<string>();

const editOutline = () => {
  visible.value = true;
};

const setOutline = (str: string) => {
  outline.value = str;
};

const send = () => {
  props.send(outline.value);
};

type ExposeType = {
  click: () => void;
};

defineExpose<ExposeType>({
  click: send,
});
</script>

<style module lang="scss">
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.outline_btn {
  font-size: theme.$font-size-base;
  color: #2b2a33;
  i {
    width: 16px;
  }
}
.send {
  background: theme.$color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  --el-button-disabled-bg-color: #306bec;
  --el-button-hover-bg-color: #306bec;

  span {
    color: #fff;
  }
  svg {
    width: 18px;
    fill: theme.$color-white;
  }
}
</style>
