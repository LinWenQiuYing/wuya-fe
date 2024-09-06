<template>
  <VoteWrapper title="踩" :class="[(voteDown || visible) && $style.active]">
    <dislike-popup v-model="visible" :text="props.voteDownComment" @submit="submit">
      <ThumpsDownIcon :class="$style.thumps_down" @click.stop="onClickVoteDown" />
    </dislike-popup>
  </VoteWrapper>
</template>

<script setup lang="ts">
import VoteWrapper from "./VoteWrapper.vue";
import DislikePopup from "./DislikePopup.vue";
import ThumpsDownIcon from "@/client/icons/thumps-down.svg";
import { ref } from "vue";

const visible = ref<boolean>(false);
const props = defineProps<{
  recordId?: number;
  voteDownComment: string | undefined;
  onVoteDown: (recordId: number, comment?: string) => Promise<void>;
}>();
const voteDown = defineModel<boolean>("voteDown");

const onClickVoteDown = async () => {
  visible.value = !visible.value;
  !voteDown.value && (await props.onVoteDown(props.recordId));
};
const submit = async (comment: string) => {
  await props.onVoteDown(props.recordId, comment);
  visible.value = false;
};
</script>

<style module lang="scss">
@use "src/styles/theme";

.active {
  color: theme.$color-primary;
}

.thumps_down:focus {
  outline: none;
}
</style>
