<template>
  <slot v-if="!hidden" />
</template>
<script lang="ts" setup>
import type { NavHiddenCondition } from "@/@types";
import isNavHidden from "@/utils/isNavHidden";
import getPlatform from "@/utils/getPlatform";

const props = defineProps<{
  readonly hidden?: NavHiddenCondition;
}>();

const platform = getPlatform();
const hidden = isNavHidden(props.hidden, platform);
</script>
