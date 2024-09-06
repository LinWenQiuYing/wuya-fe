<template>
  <router-link
    v-for="it in menu"
    :key="it.path"
    :to="it.path"
    :class="[$style.item, { active: isActive(it, route.path) }]"
    exact-active-class=""
    active-class=""
  >
    <component :is="it.icon" :class="$style.icon" />
    <span :class="$style.name">{{ it.name }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { menu } from "@/admin/routes";
import isActive from "@/utils/isActive";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style lang="scss" module>
@use "src/styles/theme";

.item {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
  border-radius: theme.$border-radius-lg;
  font-size: theme.$font-size-sm;
  font-weight: 400;
  margin: 4px 3px;
  text-align: center;
  color: theme.$text-color-secondary;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1.4;
  max-width: 100px;
  height: 70px;
  box-sizing: border-box;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    color: theme.$color-primary;
    background-color: rgb(255 255 255 / 45%);
  }

  &:first-of-type {
    margin-top: 12px;
  }
}

.name {
  transition: color 0.3s ease-in-out;
}

.icon {
  width: 28px;
  height: 28px;
  fill: currentColor;
  transition: color 0.3s ease-in-out;
}

.item:global(.active) {
  background-color: #fff;
  font-weight: 700;

  > svg {
    color: theme.$color-primary;
  }

  > span {
    color: #2d364d;
  }
}
</style>
