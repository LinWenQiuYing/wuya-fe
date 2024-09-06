<template>
  <div ref="buttonRef" :class="$style._">
    <button :class="$style.button" @click="onCheck">检查更新</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getLatestVersion, LatestVersion } from "@/client/api/version";
import { ElMessage } from "element-plus";
import InfoIcon from "@/client/icons/info.svg";

const version = ref<LatestVersion>();
const buttonRef = ref<HTMLButtonElement>();

const onCheck = async () => {
  const latestVersion = await getLatestVersion().catch(console.error);
  if (!latestVersion) return;
  version.value = latestVersion;
  if (latestVersion.steps_behind <= 0)
    return ElMessage({
      message: "当前版本已经是最新版本",
      icon: InfoIcon,
      type: "info",
      appendTo: buttonRef.value,
      customClass: "info",
    });
  window.open("InfinityOTAProto://U");
};
</script>

<style module lang="scss">
@use "src/styles/theme";

._ {
  .info {
    background: #e6f4ff;
    color: theme.$text-color-primary;
  }
}

.button {
  border: none;
  color: #086df4;
  background-color: transparent;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
}

.header {
  font-weight: bold;
  font-size: 18px;
  color: theme.$text-color-primary;
}

.desc {
  white-space: pre;
  font-size: 14px;
  color: #6d7587;
  line-height: 22px;
}
</style>
