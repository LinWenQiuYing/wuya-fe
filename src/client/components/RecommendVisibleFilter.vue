<template>
  <slot v-if="visible" />
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

const route = useRoute();
// 是否启用推荐
const visible = omitRestQueryValue(route.query.recommend) !== "off";
</script>
