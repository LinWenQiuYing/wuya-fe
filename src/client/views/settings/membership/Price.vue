<template>
  <span :class="[$style._, { primary, deprecated }]"><slot /></span>
</template>
<script lang="ts" setup>
const props = defineProps<{
  readonly deprecated?: boolean;
  readonly primary?: boolean;
}>();
const { deprecated, primary } = props;
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  font-family: Helvetica, theme.$font-family-base;
  display: flex;
  align-items: center;
  gap: 3px;

  &::before {
    content: "¥";
    font-family: theme.$font-family-base;
  }

  &:global {
    &.primary {
      color: theme.$color-primary;
      font-weight: bold;
      font-size: 32px;
      line-height: 38px;

      &::before {
        font-size: 18px;
      }
    }

    &.deprecated {
      font-size: 16px;
      color: theme.$text-color-secondary;
      line-height: 30px;
      text-decoration-line: line-through;
    }
  }
}
</style>
