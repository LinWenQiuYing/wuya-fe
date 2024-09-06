<template>
  <div :class="$style._">
    <span :class="$style.btn" @click="precisionMinus">
      <Minus />
    </span>
    <span ref="barRef" :class="$style.bar">
      <span :class="$style.percentIndicator" :style="{ width: `${indicatorWidth}px` }"></span>
      <span
        :class="$style.hot"
        :style="{ left: `${indicatorWidth}px` }"
        @mousedown="initGrabContext"
        @mousemove.passive="updateIndicatorWidth"
        @mouseup="cleanGrabContext"
      >
        <span :class="$style.positionIndicator"></span>
      </span>
    </span>
    <span :class="$style.btn" @click="precisionAdd">
      <Plus />
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { Minus, Plus } from "@element-plus/icons-vue";

type DragContext = {
  startX: number | null;
  startWidth: number | null;
};

const emit = defineEmits<{
  change: [number];
}>();

const model = defineModel<number>();
const percent = computed<number>({
  get() {
    return model.value ?? 0.5;
  },
  set(value) {
    model.value = value;
  },
});
const barRef = ref<HTMLSpanElement | null>(null);
const dragContext: DragContext = {
  startX: null,
  startWidth: null,
};
const barWidth = ref<number | null>(null);

const toFixed = (value: number) => Number.parseFloat(value.toFixed(2));
const emitPercentChange = (percentValue: number) => emit("change", percentValue);

// percent <=> indicatorWidth
const indicatorWidth = computed<number>({
  get() {
    if (!barWidth.value) return 0;
    return barWidth.value * percent.value;
  },
  set(width) {
    if (!barWidth.value) return;
    const percentValue = Math.min(1, Math.max(0, toFixed(width / barWidth.value)));
    percent.value = percentValue;
    emitPercentChange(percentValue);
  },
});

onMounted(async () => {
  await nextTick();
  const bar = barRef.value;
  if (!bar) return;
  barWidth.value = bar.clientWidth;
});

const initGrabContext = (event: MouseEvent) => {
  dragContext.startX = event.x;
  dragContext.startWidth = indicatorWidth.value;
};

const updateIndicatorWidth = (event: MouseEvent) => {
  if (dragContext.startX === null || dragContext.startWidth === null || !barWidth.value) return;
  const offsetWidth = event.clientX - dragContext.startX;
  indicatorWidth.value = dragContext.startWidth + offsetWidth;
};

const cleanGrabContext = () => {
  dragContext.startX = null;
  dragContext.startWidth = null;
};

const precisionAdd = () => {
  const value = Math.min(1, toFixed(percent.value + 0.05));
  percent.value = value;
  emitPercentChange(value);
};

const precisionMinus = () => {
  const value = Math.max(0, toFixed(percent.value - 0.05));
  percent.value = value;
  emitPercentChange(value);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  font-size: 20px;
  line-height: 1.4;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: theme.$text-color-primary;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: theme.$color-primary;
  }

  svg {
    width: 14px;
  }
}

.bar {
  width: 200px;
  height: 6px;
  background: #edeff3;
  border-radius: 3px;
  margin: 0 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
  position: relative;
}

.percentIndicator {
  height: 6px;
  background: #91caff;
  border-radius: 3px;
  width: 0;
  user-select: none;
}

.hot {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform: translateX(-50%);
  box-sizing: border-box;
  cursor: default;
  position: absolute;
}

.positionIndicator {
  width: 14px;
  height: 14px;
  background: #fff;
  border: 2px solid #91caff;
  border-radius: 50%;
  box-sizing: border-box;
  user-select: none;
}
</style>
