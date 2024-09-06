<template>
  <div :class="$style._">
    <div v-if="headerVisible" :class="$style.header">
      <BackIcon @click="router.go(-1)" />
      <div>{{ title }}</div>
    </div>
    <div :class="$style.content" :style="`margin-top: ${headerVisible ? 0 : 10}px`">
      <div v-html="html"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import md from "markdown-it";
import BackIcon from "../icons/back.svg";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const props = defineProps<{
  readonly source: string;
  readonly title: string;
}>();

const generator = md({
  html: true,
});
const html = generator.render(props.source);

const router = useRouter();
const route = useRoute();

const headerVisible = computed(() => {
  return route.query?.header !== "off";
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

$color-strong: #202020;

._ {
  color: #2d364d;
  height: 100%;

  .header {
    display: flex;
    line-height: 28px;
    margin: 19px 15px 10px;

    svg {
      width: 18px;
      height: 18px;
    }

    div {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      flex: 1;
    }
  }

  .content {
    padding: 0 15px;
    height: calc(100% - 57px);
    overflow-y: auto;
  }

  :global {
    .md-edition-info {
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      margin-bottom: 16px;
      margin-left: 23px;
    }

    .md-date-info {
      text-align: right;
      font-size: 12px;
      line-height: 21px;
    }

    @media (max-width: 750px) {
      .bg-gray {
        background-color: #fff;
      }
    }

    .last-info {
      margin-bottom: 20px;
    }
  }

  h1,
  h2,
  h3,
  strong,
  :global(.strong) {
    color: $color-strong;
    font-weight: bold;
  }

  h1 {
    display: none;
  }

  h2 {
    margin: 40px 0 5px;
    font-size: 18px;
  }

  h3 {
    margin: 20px 0 5px;
    font-size: 16px;
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
    font-weight: normal;
    font-size: 14px;
  }

  td {
    border: 1px solid #ddd;
    padding: 4px 10px;
    font-weight: normal !important;
  }

  a {
    color: theme.$color-primary;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    font-size: 14px;
    line-height: 24px;
    text-align: justify;
    margin-bottom: 30px;
  }
}
</style>
