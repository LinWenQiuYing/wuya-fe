<template>
  <div :class="$style._">
    <div :class="$style.banner">
      <img :src="Background" :class="{ loaded }" @load="() => (loaded = true)" />
    </div>
    <div :class="$style.wrapper">
      <h1 :class="$style.h1">您好！我是您的智能助手</h1>
      <p :class="$style.p">和我聊天时，随时@我，召唤您的私人助理</p>
      <agent-cards />
    </div>
  </div>
</template>
<script setup lang="ts">
import AgentCards from "@/client/views/agent/AgentCards.vue";
import Background from "./background.png";
import { ref } from "vue";

const loaded = ref<boolean>(false);
</script>

<style module lang="scss">
@use "src/styles/theme";

._ {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  justify-content: center;
  align-items: center;
  background: linear-gradient(311deg, #eff5ff 100%, #d8eaff 0%);
}

@media (max-width: 500px) {
  ._ {
    justify-content: flex-start;
    padding: 50px 0;
  }
}

@media (max-height: 700px) {
  ._ {
    justify-content: flex-start;
    padding: 50px 0;
  }
}

.logo {
  width: 220px;
  margin: 45px auto;
}

.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  img {
    display: block;
    height: 390px;
    width: 110%;
    opacity: 0;
    transition: opacity 1.5s;
  }

  :global(.loaded) {
    opacity: 1;
  }
}

.wrapper {
  z-index: 1;
  max-width: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.robot {
  flex: 0 0 58px;
  width: 62px;
  height: 58px;
}

.h1 {
  font-weight: bold;
  font-size: 24px;
  color: theme.$text-color-primary;
  line-height: 31px;
}

.p {
  padding-top: theme.$padding-sm;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
}
</style>
