<template>
  <el-checkbox v-model="checked">
    <span>{{ props.predicate }}</span>
    <PrivacyLink :class="props.linkClass" />
    <span>和</span>
    <TermsLink :class="props.linkClass" />
    <template v-if="$slots.default">
      <slot />
    </template>
  </el-checkbox>
  <Teleport to="body">
    <TermsCheckDialog v-model:visible="tip" v-model:checked="checked">
      <PrivacyLink :class="props.linkClass" />
      <span>和</span>
      <TermsLink :class="props.linkClass" />
    </TermsCheckDialog>
  </Teleport>
</template>
<script lang="ts" setup>
import TermsLink from "./TermsLink.vue";
import PrivacyLink from "./PrivacyLink.vue";
import TermsCheckDialog from "./TermsCheckDialog.vue";

const props = defineProps<{
  readonly linkClass?: string;
  readonly predicate: string;
}>();

const checked = defineModel<boolean>("checked");
const tip = defineModel<boolean>("tip");
</script>
