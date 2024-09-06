<template>
  <div :class="visible && (props.none ? $style.none : $style.visible)">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
const props = defineProps<{
  none?: boolean;
}>();
const route = useRoute();
const visible = omitRestQueryValue(route.query.tag) === "off";
</script>
<style lang="scss" module>
.visible {
  visibility: hidden;
}

.none {
  display: none;
}
</style>
