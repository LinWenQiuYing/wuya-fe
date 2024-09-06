<template>
  <span :class="[style.a, { [style.b]: condition }]">xxx</span>
  <span :class="style.a">xxx</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import style from "./index.module.scss";

const condition = ref(false);
</script>
