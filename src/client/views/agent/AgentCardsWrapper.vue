<template>
  <div :class="$style.cards">
    <slot></slot>
  </div>
</template>
<script setup lang="ts"></script>

<style module lang="scss">
.cards {
  padding-top: 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 800px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
