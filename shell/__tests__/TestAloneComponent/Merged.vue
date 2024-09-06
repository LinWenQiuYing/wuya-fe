<template>
  <span :class="[$style.a, { [$style.b]: condition }]">xxx</span>
  <span :class="$style.a">xxx</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const condition = ref(false);
</script>

<style lang="scss" module>
.a {
  font-size: 14px;
}

.b {
  font-weight: normal;
}
</style>
