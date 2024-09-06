<template>
  <VoteWrapper title="赞" @click="onClick">
    <div ref="lottieRef" :class="$style.lottie" />
  </VoteWrapper>
</template>

<script setup lang="ts">
import initLottie from "@/client/lottie/initLottie";
import { AnimationItem } from "lottie-web";
import VoteWrapper from "./VoteWrapper.vue";
import { onMounted, ref, watch } from "vue";
import thumpsUp from "@/client/lottie/thumps-up.json";

const emit = defineEmits(["onVoteUp"]);
const voteUp = defineModel<boolean>("voteUp");
const voteDown = defineModel<boolean>("voteDown");
const flag = ref<boolean>(false);
const lottieRef = ref<HTMLDivElement>();
const animation = ref<AnimationItem>();

const onClick = () => {
  emit("onVoteUp");
  if (!flag.value) flag.value = true;
  if (voteUp.value) {
    animation.value?.goToAndStop(0, true);
  } else {
    animation.value?.play();
    animation.value?.setSpeed(1.8);
  }
};
watch([() => voteUp.value, () => flag.value, () => animation.value], ([voteUp, flag, animation]) => {
  if (voteUp && !flag && animation) animation.goToAndStop(animation.totalFrames - 1, true);
});
watch([() => voteDown.value, () => animation.value], ([voteDown, animation]) => {
  if (voteDown && animation) animation.goToAndStop(0, true);
});

onMounted(() => {
  if (lottieRef.value) {
    animation.value = initLottie(thumpsUp, lottieRef.value);
  }
});
</script>

<style module lang="scss">
.lottie {
  width: 18px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
