<template>
  <slot v-if="!pure" />
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

const route = useRoute();
// 纯净模式, 通过在url查询字符串中设置 ?pure=on 启用
// 纯净模式下, 无侧边栏
const pure = omitRestQueryValue(route.query.pure) === "on";
</script>
