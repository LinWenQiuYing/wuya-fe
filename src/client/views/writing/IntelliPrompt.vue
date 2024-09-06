<template>
  <div :class="$style._">
    <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
    <Component :is="icon" v-else :class="$style.icon" />
    <label :class="$style.title">{{ props.action.name }}:</label>
    <input
      ref="inputRef"
      v-model="prompt"
      :placeholder="props.placeholder"
      :class="$style.input"
      @keydown.enter="(e: KeyboardEvent) => handleKeyEnter(e, onEnter)"
      @keydown.esc="onEscape"
      @focus="emitFocus"
    />
    <LinkButton :disabled="!prompt.length" :icon="EnterIcon" @click="submit">
      <span>Enter</span>
    </LinkButton>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { EditAction } from "./editActions";
import LinkButton from "./LinkButton.vue";
import EnterIcon from "@/client/icons/enter-stroke.svg";
import { Loading } from "@element-plus/icons-vue";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const prompt = defineModel<string>("prompt", { required: true });
const loading = defineModel<boolean>("loading");
const props = defineProps<{
  placeholder?: string;
  action: EditAction;
  // this prop just for type hack, vue will auto create props.onSubmit by define event emit `submit`
  onSubmit?: () => unknown;
}>();

const emit = defineEmits<{
  focus: [];
  submit: [string];
  reset: [];
}>();

const icon = props.action.hot ?? props.action.icon;

const inputRef = ref<HTMLInputElement>();

const submit = async () => {
  if (typeof props.onSubmit !== "function") return;
  loading.value = true;
  try {
    await props.onSubmit();
  } finally {
    loading.value = false;
  }
};

const onEnter = async () => {
  await nextTick();
  if (!prompt.value.length) return;
  await submit();
};

// 取消编辑
const onEscape = () => {
  prompt.value = "";
  emit("reset");
};

const emitFocus = () => emit("focus");

onMounted(() => {
  const input = inputRef.value;
  if (!input) return;
  input.focus();
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: grid;
  grid-template-columns: 20px min-content auto min-content;
  grid-gap: 4px;
  height: 36px;
  padding: 0 12px;
  align-items: center;
  font-size: 14px;
}

.icon {
  height: 20px;
  display: block;
  --gradient-color-start: #36b7f9;
  --gradient-color-middle: #9572ff;
  --gradient-color-stop: #ff5868;
}

.title {
  cursor: default;
  user-select: none;
  word-break: keep-all;
  color: theme.$text-color-primary;
}

.input {
  border: unset;
  outline: unset;
  padding: 0 4px;

  &::placeholder {
    color: #b3b9c7;
    user-select: none;
  }
}
</style>
