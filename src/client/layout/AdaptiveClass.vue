<template>
  <div v-if="$attrs.class">
    <slot />
  </div>
  <slot v-else />
</template>
