<template>
  <div :class="$style._">
    <h2>{{ route.meta.nav?.name }}</h2>
    <router-link v-if="isKnowledge" :class="$style.tag" to="/admin/knowledge/tags">
      <TagIcon />
      <span>标签管理</span>
    </router-link>
    <UserInfo :class="$style.bar" />
  </div>
</template>

<script setup lang="ts">
import UserInfo from "./UserInfo.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import TagIcon from "@/admin/icons/tag.svg";

const route = useRoute();
const isKnowledge = computed(() => route.meta.code === "knowledge");
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  border-bottom: 1px solid #e0e4f1;
  padding: theme.$padding-xss theme.$padding-xl;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #f6f8fe;

  > h2 {
    font-weight: 400;
    font-size: 18px;
    line-height: 1.4;
  }
}

.tag {
  display: flex;
  align-items: center;
  margin-left: theme.$margin-xl;
  font-size: theme.$font-size-base;
  font-weight: 400;
  cursor: pointer;
  color: inherit;

  &:hover,
  &:active {
    color: theme.$color-primary;
  }

  svg {
    height: 16px;
    color: inherit;
    fill: currentColor;
  }
}

.bar {
  margin-left: auto;
}
</style>
