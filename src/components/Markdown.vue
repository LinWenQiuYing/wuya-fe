<template>
  <div :class="$style._" v-html="html" />
</template>
<script lang="ts" setup>
import md from "markdown-it";

const props = defineProps<{
  readonly source: string;
}>();

const generator = md({
  html: true,
});
const html = generator.render(props.source);
</script>
<style lang="scss" module>
@use "src/styles/theme";

$color-strong: #202020;

._ {
  line-height: 24px;

  h1,
  h2,
  h3,
  strong,
  :global(.strong) {
    color: $color-strong;
    font-weight: bold;
  }

  h1 {
    font-size: 32px;
    line-height: 42px;
    text-align: center;
    margin: 20px 0;
  }

  h2 {
    margin: 40px 0 5px;
  }

  h3 {
    margin: 20px 0 5px;
  }

  ol {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
  }

  td {
    border: 1px solid #ddd;
    padding: 4px 10px;
    word-break: keep-all;
  }

  a {
    color: theme.$color-primary;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin: 12px 0;
  }
}
</style>
