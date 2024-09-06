<template>
  <div :class="[$style._, isMobile ? $style.h5 : $style.pc]">
    <div :class="$style.content">
      <div :class="$style.warp">
        <InformationList />
      </div>
      <InformationRightSide v-if="!isMobile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isMobile } from "@/config";
import InformationList from "./components/informationList/index.vue";
import InformationRightSide from "./components/informationRightSide/index.vue";
</script>

<style lang="scss" module>
@import "src/styles/theme";

._ {
  display: flex;
  height: 100%;
  background: #fff;

  .content {
    display: flex;
    max-width: 1050px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
  }

  .warp {
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &.pc {
    min-width: 1050px;

    .content {
      padding: 34px 56px;
    }

    .warp {
      width: calc(100% - 350px);
      padding-bottom: 36px;
    }
  }

  &.h5 {
    .content {
      background-image: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 8%, #fff 21%, #fff 100%);
    }

    .warp {
      width: 100%;
    }
  }
}
</style>
