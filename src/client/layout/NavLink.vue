<template>
  <span v-if="disabled" :class="$style.disabled"><slot /></span>
  <router-link
    v-else
    :to="props.to"
    :replace="!!replace"
    exact-active-class=""
    active-class=""
    @click="() => emit('click')"
  >
    <slot />
  </router-link>
</template>
<script lang="ts" setup>
const props = defineProps<{
  to: string;
  replace?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>
<style lang="scss" module>
.disabled {
  cursor: not-allowed;
}
</style>
