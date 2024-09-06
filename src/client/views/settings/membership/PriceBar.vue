<template>
  <div v-if="props.originalPrice" :class="$style._">
    <template v-if="hasDiscount">
      <Price primary>{{ props.discountedPrice }}</Price>
      <Price deprecated>{{ props.originalPrice }}</Price>
    </template>
    <template v-else>
      <Price primary>{{ props.originalPrice }}</Price>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import Price from "./Price.vue";

const props = defineProps<{
  discountedPrice?: number;
  originalPrice?: number;
}>();

const hasDiscount = computed(() => props.discountedPrice && props.discountedPrice !== props.originalPrice);
</script>
<style lang="scss" module>
._ {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}
</style>
