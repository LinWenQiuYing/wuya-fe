import { describe, expect, test } from "vitest";
import { replaceStyleReference, inlineComponentStyle } from "../inlineCSSModule";
import fs from "node:fs";
import path from "node:path";

describe("replaceStyleReference", () => {
  test("normally", () => {
    const sourceCode = `<span :class="[style.a, {[style.b]: condition}]">xxx</span><span :class="style.c">xx</span>`;
    const expected = `<span :class="[$style.a, {[$style.b]: condition}]">xxx</span><span :class="$style.c">xx</span>`;
    expect(replaceStyleReference(sourceCode)).toBe(expected);
  });
});

describe("inlineComponentStyle", () => {
  test("normally", () => {
    const styleSourceCode =
      `
.a {
  font-size: 14px;
}

.b {
  font-weight: normal;
}
`.trim() + "\n";

    const vueSourceCode =
      `
<template>
  <span :class="[style.a, {[style.b]: condition}]">xxx</span>
  <span :class="style.a">xxx</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import style from "./index.module.scss";

const condition = ref(false);
</script>
`.trim() + "\n";

    const mergedSourceCode =
      `
<template>
  <span :class="[$style.a, {[$style.b]: condition}]">xxx</span>
  <span :class="$style.a">xxx</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const condition = ref(false);
</script>

<style lang="scss" module>
.a {
  font-size: 14px;
}

.b {
  font-weight: normal;
}
</style>
`.trim() + "\n";

    expect(inlineComponentStyle(vueSourceCode, styleSourceCode)).toBe(mergedSourceCode);
  });

  test("native", () => {
    const vueSourceCode = fs.readFileSync(
      path.resolve(import.meta.dirname, "./TestAloneComponent/index.vue"),
      "utf-8",
    );
    const styleSourceCode = fs.readFileSync(
      path.resolve(import.meta.dirname, "./TestAloneComponent/index.module.scss"),
      "utf-8",
    );
    const mergedSourceCode = fs.readFileSync(
      path.resolve(import.meta.dirname, "./TestAloneComponent/Merged.vue"),
      "utf-8",
    );

    expect(inlineComponentStyle(vueSourceCode, styleSourceCode)).toBe(mergedSourceCode);
  });
});
