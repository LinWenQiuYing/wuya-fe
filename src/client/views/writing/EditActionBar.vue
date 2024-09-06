<template>
  <div :class="$style._">
    <LinkButton
      v-for="action in actions"
      :key="action.code"
      :icon="action.icon"
      :active="action.active"
      :class="{ split: action.split }"
      @click="() => fireEdit(action.code)"
    >
      <span>{{ action.name }}</span>
    </LinkButton>
    <slot />
  </div>
</template>
<script setup lang="ts">
import LinkButton from "./LinkButton.vue";
import editActionMap, { EditActionCode } from "./editActions";

const props = defineProps<{
  readonly actions: EditActionCode[];
}>();

const emit = defineEmits<{
  click: [EditActionCode];
}>();

const actions = props.actions.map((action) => editActionMap[action]);
const fireEdit = (code: EditActionCode) => emit("click", code);
</script>
<style lang="scss" module>
._ {
  display: grid;
  grid-column-gap: 16px;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-items: center;

  > :global(.split)::before {
    content: " ";
    height: 19px;
    border-left: 1px solid #dddfe3;
    margin-right: 12px;
  }
}
</style>
