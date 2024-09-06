<template>
  <div :class="$style._">
    <div v-for="(it, index) in list" :key="index" :class="$style.group">
      <span v-if="it.title">{{ it.title }}</span>
      <a v-if="it.link" :class="$style.link" :href="it.link" target="_blank">
        {{ it.text }}
      </a>
      <span v-else>{{ it.text }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useICPConf from "@/client/hooks/useICPConf";

const list = await useICPConf();
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #bbb;
  line-height: 20px;
  flex-wrap: wrap;
}

.group {
  padding: 0 6px;
  flex-shrink: 0;
}

.link {
  color: inherit;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: theme.$text-color-secondary;
  }
}
</style>
