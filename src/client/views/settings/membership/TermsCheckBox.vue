<template>
  <el-checkbox v-model="checked" :class="$style._" @change="onTermsChecked">
    <span>我已阅读并同意</span>
    <MemberTermsLink v-model="termsVisible" />
    <Teleport to="body">
      <MemberTermsDialog v-if="termsVisible" v-model="termsVisible" />
    </Teleport>
  </el-checkbox>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MemberTermsDialog from "./MemberTermsDialog.vue";
import MemberTermsLink from "./MemberTermsLink.vue";

const checked = defineModel<boolean>();

const emit = defineEmits<{
  change: [boolean];
}>();

const termsVisible = ref(false);

const onTermsChecked = (value: boolean) => emit("change", value);
</script>
<style lang="scss" module>
._ {
  &:global(.el-checkbox) {
    --el-checkbox-checked-text-color: inherit;
  }
}
</style>
