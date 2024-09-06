<template>
  <div :class="$style._">
    <LogoIcon />
    <IntelliEditIcon />
  </div>
</template>
<script setup lang="ts">
import LogoIcon from "@/client/icons/logo.svg";
import IntelliEditIcon from "@/client/icons/pencil-outline-stars-gradient.svg";
</script>

<style lang="scss" module>
._ {
  width: 0;
  height: 0;
}
</style>
