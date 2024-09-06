<template>
  <button type="button" :class="[props.class, $style._]" @click="showDialog"><slot /></button>
  <Teleport to="body">
    <ContactUsDialog v-model="dialogVisible" @next="reportNext" />
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ContactUsDialog from "./ContactUsDialog.vue";

const emit = defineEmits<{
  next: [];
}>();

const props = defineProps<{
  readonly class?: string;
}>();

const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};

const reportNext = () => {
  emit("next");
};
</script>
<style lang="scss" module>
._ {
  color: #086df4;
  background: transparent;
  border: 0 none;
  box-shadow: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
