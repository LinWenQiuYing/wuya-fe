<template>
  <div :class="$style._">
    <h2 :class="$style.main">{{ props.title }}</h2>
    <slot />
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  title: string;
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 40px 0;
  user-select: none;
}

.main {
  margin: 0 auto 0 0;
  font-size: 22px;
  font-weight: bold;
  line-height: 36px;
  cursor: default;
}

@media (max-width: 940px) {
  ._ {
    margin: 5px 0 15px;
  }
}
</style>
