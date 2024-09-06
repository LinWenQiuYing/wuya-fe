<template>
  <FoldContext v-if="props.enabled">
    <template #default="{ folded }">
      <slot :folded="folded" />
    </template>
  </FoldContext>
  <AdaptiveClass v-else>
    <slot :folded="true" />
  </AdaptiveClass>
</template>
<script lang="ts" setup>
import FoldContext from "./FoldContext.vue";
import AdaptiveClass from "./AdaptiveClass.vue";

const props = defineProps<{
  // 决定是否启用折叠功能
  enabled: boolean;
}>();
</script>
