<template>
  <el-tooltip :offset="-5" effect="light" placement="right">
    <template #content>
      <span :class="$style.content"
        >请<router-link :to="preferSignEntry" :class="$style.link" @click="() => reAuth({ remote: false })"
          >登录</router-link
        >后使用</span
      >
    </template>
    <template #default>
      <slot />
    </template>
  </el-tooltip>
</template>
<script lang="ts" setup>
import getPreferSignEntry from "@/sign/getPreferSignEntry";
import reAuth from "@/sign/reAuth";

const preferSignEntry = await getPreferSignEntry();
</script>
<style lang="scss" module>
@use "src/styles/theme";

.content {
  font-size: 12px;
  color: theme.$text-color-primary;
}

.link {
  color: theme.$color-primary;

  &:hover {
    text-decoration: underline;
  }
}
</style>
