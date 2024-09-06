<template>
  <div :class="$style._">
    <div v-for="(it, index) in intro" :key="index" :class="$style.item">
      <component :is="it.icon" :class="$style.icon" />
      <h4 :class="$style.title">{{ it.title }}</h4>
      <p :class="$style.desc">{{ it.description }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import intro from "./intro";
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
}

.item {
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 4px;
}

.icon {
  width: 20px;
  display: block;
  fill: theme.$text-color-primary;
  align-self: center;
}

.title {
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 24px;
  align-self: center;
}

.desc {
  font-size: 14px;
  color: theme.$text-color-secondary;
  line-height: 22px;
  grid-column: 2;
  grid-row: 2;
}
</style>
