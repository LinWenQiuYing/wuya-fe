<template>
  <div class="record-button">
    <el-button class="button" @click="onClick">
      <MicrophoneIcon class="icon" />
      <span v-if="isRecording">录音中，点击完成</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useParseRecord } from "@/client/hooks/useParseRecord";
import { watch } from "vue";
import MicrophoneIcon from "@/client/icons/microphone.svg";

const emit = defineEmits(["setData"]);
const { parseLoading, parseData, isRecording, startRecord, stopRecord } = useParseRecord();

const onClick = () => (isRecording ? stopRecord() : startRecord());

watch([() => parseLoading.value, () => parseData.value], (value) => {
  emit("setData", value);
});
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.record-button {
  padding: 0 $padding-xs;
  display: flex;
  align-items: center;

  .button {
    border-radius: 16px;
    font-size: $font-size-base;
    color: $text-color-primary;
    font-weight: 400;
  }
}

.icon {
  width: 20px;
  height: 20px;
  color: $text-color-primary;

  &:hover {
    color: $color-primary;
  }
}
</style>
