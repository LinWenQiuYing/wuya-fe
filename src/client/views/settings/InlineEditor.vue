<template>
  <div :class="[props.class, $style._]">
    <template v-if="editing">
      <el-input
        ref="inputRef"
        v-model="displayValue"
        :class="[props.class, $style.input]"
        clearable
        @keydown.enter="(e: KeyboardEvent) => handleKeyEnter(e, confirmValueChange)"
        @keydown.esc="discardValueChange"
      />
      <button type="button" :class="$style.btn" @click="discardValueChange">
        <Close />
      </button>
      <button type="button" :class="$style.btn" @click="confirmValueChange">
        <Check />
      </button>
    </template>
    <template v-else>
      <span>{{ displayValue }}</span>
      <button type="button" :class="$style.btn" @click="switchEditView">
        <EditIcon />
      </button>
    </template>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import EditIcon from "@/client/icons/pencil-line.svg";
import handleKeyEnter from "@/client/utils/handleKeyEnter";
import { ElMessage } from "element-plus";
import isValidUserName from "./isValidUserName";

const editing = defineModel<boolean>();
const props = defineProps<{
  value: string;
  class?: string;
}>();

const emit = defineEmits<{
  change: [string];
}>();

const inputRef = ref<HTMLInputElement>();
const displayValue = ref(props.value);
const switchEditView = async () => {
  editing.value = true;
  await nextTick();
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.focus();
    inputElement.select();
  }
};

const confirmValueChange = () => {
  if (props.value === displayValue.value) return;
  if (!displayValue.value || displayValue.value.length > 30 || !isValidUserName(displayValue.value))
    return ElMessage.info("请输入30字以内的中英文、数字");
  emit("change", displayValue.value);
};

const discardValueChange = () => {
  displayValue.value = props.value;
  editing.value = false;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
}

.btn {
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  padding: 0;
  margin-right: 4px;

  &:hover {
    color: theme.$color-primary;
  }

  svg {
    width: 18px;
    fill: currentColor;
  }

  &:first-of-type {
    margin-left: 4px;
  }
}
</style>
