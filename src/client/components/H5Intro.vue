<template>
  <div :class="$style._">
    <LogoIcon :class="$style.infinity" />
    <p :class="$style.desc">让知识即刻呈现，让回答值得信赖</p>
  </div>
</template>
<script setup lang="ts">
import LogoIcon from "@/client/icons/logo-books-name-vertical.svg";
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: 12vh;
}

.infinity {
  display: block;
  height: 81px;
  margin-bottom: 10px;
}

.desc {
  color: theme.$text-color-secondary;
  margin: 6px 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
}
</style>
