<template>
  <div :class="$style.answer_content" :data-hidden="props.hidden" v-html="props.html" />
</template>
<script setup lang="ts">
const props = defineProps<{
  hidden?: string;
  html: InnerHTML;
}>();
</script>
<style module lang="scss">
@use "src/styles/theme";

.answer_content {
  width: 100%;
  border-radius: theme.$border-radius-xxl;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 28px;
  font-weight: 400;
  text-align: justify;
  word-wrap: break-word;

  :global {
    img {
      max-width: 100%;
      margin: theme.$padding-md 0;
      background: #d8d8d8;
      border-radius: 8px;
      height: auto;
      border: 1px solid #979797;
    }

    .corner-mark {
      position: relative;
      color: theme.$color-primary;
      top: -1px;
      display: inline-block;
      background: #e6f5ff;
      padding: 0 4px;
      //width: 14px;
      height: 14px;
      text-align: center;
      line-height: 14px;
      border-radius: 2px;
      font-size: 12px;
      margin-left: 5px;
      cursor: pointer;

      &:hover {
        .tooltip_content {
          display: flex;
        }
      }
    }

    .tooltip_content {
      display: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    li {
      font-size: 16px;
      margin: 0 0 8px;
    }

    ul,
    ol {
      padding-inline-start: 40px;
      margin-top: 0;
      margin-bottom: 0;
    }

    li {
      list-style-type: disc;
    }

    hr {
      background-color: #dddfe3;
      border: 0;
      height: 1px;
    }

    pre {
      //white-space: pre-wrap;
      //word-wrap: break-word;
      display: flex;
      flex-direction: column;
      width: 100%;
      border: none;
      border-radius: 6px;
      background-color: #f8f9fb;
      overflow-x: auto;
    }

    pre code {
      background-color: #f8f9fb !important;
      padding: 10px;
      width: 100%;
      font-size: 14px;
      line-height: 16px;
      text-align: left;
      font-style: normal;
    }

    .code-box {
      display: flex;
      width: 100%;
      padding: 10px 16px 0 10px;

      ul,
      li {
        list-style: none;
        margin-bottom: 0;
        padding-inline-start: 0;
      }
    }

    .line-box {
      color: #999999;
      font-size: theme.$background-color-base;
      line-height: 16px;
      text-align: left;
      padding-right: 10px;
    }

    .tool-box {
      background: #f0f2f7;
      color: #2d364d;
      height: 36px;
      padding: 0 10px;
      border-radius: 4px 4px 0 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: theme.$font-size-sm;

      .code-lang {
        flex: auto;
        font-weight: normal;
        font-size: 14px;
        color: #2d364d;
      }

      .toolbar {
        display: flex;
        align-items: center;
        padding-left: 4px;
        cursor: pointer;

        img {
          width: 16px;
          height: auto;
          padding-right: 4px;
          margin: 0;
          background: transparent;
          border-radius: 0;
          border: none;
        }
      }
    }
  }

  &[data-hidden*="h2"] h2,
  &[data-hidden*="h3"] h3,
  &[data-hidden*="h4"] h4,
  &[data-hidden*="h5"] h5,
  &[data-hidden*="h6"] h6 {
    display: none;
  }

  table {
    margin: 16px 0;
    display: block;
    overflow-x: auto;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    white-space: nowrap;
  }

  th {
    font-weight: 500;
    font-size: 14px;
    color: #6d7587;
    background: #f0f2f7;
  }

  td,
  th {
    padding: 5px 10px;
    border: 1px solid #dddfe3;
  }
}
</style>
