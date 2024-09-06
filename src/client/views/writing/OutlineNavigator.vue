<template>
  <nav v-if="props.list">
    <a v-for="it in props.list" :key="it.id" :href="`#${it.id.toString(16)}`" :class="$style.link">{{
      parseHeadMarkdown(it.name)
    }}</a>
  </nav>
</template>
<script lang="ts" setup>
import parseHeadMarkdown from "./parseHeadMarkdown";
type Anchor = {
  name: string;
  id: number;
};
const props = defineProps<{
  list: Anchor[] | null;
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";

.link {
  font-size: 14px;
  color: #6d7587;
  display: flex;
  align-items: start;
  line-height: 20px;
  transition: color 0.3s ease-in-out;

  & + & {
    margin-top: 8px;
  }

  &::before {
    content: " ";
    display: block;
    line-height: 20px;
    height: 20px;
    width: 0;
    border-left: 2px solid #dddfe3;
    margin-right: 14px;
    transition: border-left-color 0.3s ease-in-out;
  }

  &:global(.active) {
    color: theme.$text-color-primary;
    font-weight: bold;
  }

  &:hover {
    color: theme.$text-color-primary;
  }
}
</style>
