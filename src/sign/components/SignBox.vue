<template>
  <div :class="[props.class, $style._]">
    <img v-if="!isMobile" :src="src" alt="" :class="$style.bg" />
    <Logo :class="$style.logo" />
    <div :class="$style.main">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from "@/components/Logo.vue";
import { useRoute } from "vue-router";
import moonLanding from "./images/moon-landing.png";
import moonNoLogoLanding from "./images/moon-no-logo.png";
import { isMobile } from "@/config";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

const props = defineProps<{
  class?: string;
}>();
const route = useRoute();
const src = omitRestQueryValue(route.query.tag) === "off" ? moonNoLogoLanding : moonLanding;
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-bg);
  background-size: contain;
  border-radius: 6px;
  box-shadow: 0 0 40px rgb(0 0 0 / 20%);
}

.main {
  max-height: 100%;
  background: var(--primary-bg);
  overflow: hidden auto;
  border-radius: 2px;
  width: 300px;
  box-sizing: content-box;
  padding: 10px 20px;
}

@media (min-width: 940px) {
  ._ {
    box-sizing: border-box;
    width: 1200px;
    height: 680px;
    padding-left: 592px;
    max-width: 80vw;
  }

  .bg {
    height: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    display: block;
  }

  .logo {
    display: none;
  }
}

@media (min-width: 940px) and (max-width: 1200px) {
  .main {
    position: absolute;
    right: 20px;
  }
}

@media (max-width: 940px) {
  ._ {
    padding: 20px 0;
    height: unset;
    width: 61.8vw;
    min-width: 340px;
    flex-direction: column;
    max-height: 96%;
  }

  .main {
    width: 300px;
    padding: 0 20px;
  }

  .bg {
    display: none;
  }
}
</style>
