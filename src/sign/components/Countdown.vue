<template>
  <button
    ref="buttonRef"
    type="button"
    :class="[props.class, $style._]"
    :style="buttonPatchStyle"
    :disabled="counting"
    @click="emitClickEvent"
  >
    <el-countdown
      v-if="counting"
      format="ss"
      :value="expired"
      suffix="s"
      :class="$style.countdown"
      @change.once="markSent"
      @finish="stopCounting"
    />
    <template v-else>{{ sent ? retryTips : placeholder }}</template>
  </button>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";

// 是否正在倒计时, 设置counting为true的时候也需要重置过期时间 expired
const counting = defineModel<boolean>();
const emit = defineEmits<{
  // 点击事件
  click: [];
  // 结束事件 (倒计时结束后触发)
  finish: [];
}>();
const props = defineProps<{
  // 倒计时的过期时间
  expired: number;
  readonly class?: string;
  readonly placeholder?: string;
  readonly retryTips?: string;
}>();

// 是否已发送过验证码
const sent = ref(false);
const buttonRef = ref<HTMLButtonElement>();
// 为按钮添加一个最小宽度, 避免内部显示内容变成倒计时后, 宽度坍塌
const buttonPatchStyle = ref<string>();
const placeholder = props.placeholder ?? "获取验证码";
const retryTips = props.retryTips ?? "重新发送";

onMounted(async () => {
  await nextTick();
  const button = buttonRef.value;
  if (!button) return;
  const clientRect = button.getBoundingClientRect();
  buttonPatchStyle.value = `min-width: ${clientRect.width}px`;
});

const emitClickEvent = () => {
  emit("click");
};

// 结束倒计时
const stopCounting = () => {
  counting.value = false;
  emit("finish");
};

// 标记为“已发送” (影响倒计时结束后的文本提示)
// 这里有一个假设: 仅当发送验证码的接口请求成功了后, 才会开始倒计时
// 所以一旦开始倒计时, 就当已发送
const markSent = () => {
  sent.value = true;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";
._ {
  background-color: transparent;
  border-color: transparent;
  color: inherit;
  box-shadow: none;
  font-size: inherit;
  display: inline-block;
  cursor: pointer;
  height: 100%;
  line-height: 20px;

  :global(.el-statistic) {
    --el-statistic-content-font-size: inherit;
  }
}
</style>
