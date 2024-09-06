<template>
  <slot></slot>
</template>

<script setup lang="ts">
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const changeFavIco = () => {
  const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (link) {
    if (omitRestQueryValue(route.query.tag) !== "off") {
      link.href = "/favicon.ico";
      document.title = "无涯Infinity - 星环科技";
    } else {
      document.title = "青浦政务助手";
    }
  }
};

onMounted(() => {
  changeFavIco();
});
</script>
