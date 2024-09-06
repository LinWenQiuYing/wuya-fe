<template>
  <div :class="$style._">
    <AsideDynamicVisibleFilter>
      <AsideConfigVisibleFilter>
        <FoldDispatcher v-slot="{ folded }" :enabled="!!route.meta.sidecar" :class="$style.aside">
          <div :class="$style.box">
            <div :class="$style.menuColumn">
              <Logo :title-visible="!cubed" :class="{ [$style.tiledLogo]: !cubed }" />
              <Menu :class="$style.menu" />
            </div>
            <Sidecar v-show="!folded" />
          </div>
          <ControlBar :compact="cubed ? folded : false" />
        </FoldDispatcher>
      </AsideConfigVisibleFilter>
    </AsideDynamicVisibleFilter>
    <div :class="$style.main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Logo from "@/components/Logo.vue";
import ControlBar from "./ControlBar.vue";
import Menu from "./Menu.vue";
import AsideDynamicVisibleFilter from "./AsideDynamicVisibleFilter.vue";
import AsideConfigVisibleFilter from "./AsideConfigVisibleFilter.vue";
import FoldDispatcher from "./FoldDispatcher.vue";
import Sidecar from "./Sidecar.vue";
import getPlatformConfig from "@/utils/getPlatformConfig";
import { defaultMenuStyle } from "@/router";
import { isMobile } from "@/config";

const route = useRoute();
const crossPlatformMenuStyle = computed(() => route.meta.menuStyle ?? defaultMenuStyle);
const h5MenuStyle = computed(() => getPlatformConfig(crossPlatformMenuStyle.value, "h5") ?? defaultMenuStyle);
const pcMenuStyle = computed(() => getPlatformConfig(crossPlatformMenuStyle.value, "pc") ?? defaultMenuStyle);
const cubed = computed(() => {
  const menuStyle = isMobile ? h5MenuStyle.value : pcMenuStyle.value;
  return menuStyle === "cubed";
});
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: stretch;
  background: linear-gradient(
      311deg,
      rgb(249 232 233 / 0%) 0%,
      rgb(250 239 240 / 50%) 39%,
      rgb(255 255 255 / 36%) 100%
    ),
    linear-gradient(
      240deg,
      rgb(249 248 255 / 90%) 0%,
      rgb(247 235 247 / 90%) 39%,
      rgb(228 231 245 / 90%) 61%,
      rgb(255 255 255 / 90%) 100%
    );
}

.aside {
  box-sizing: border-box;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tiledLogo {
  margin: 10px 12px;
}

.main {
  flex: 1;
  height: 100%;
  position: relative;
  // overflow: hidden;
  // z-index: 0;
}

.box {
  flex: 1;
  height: calc(100% - 70px);
  display: flex;
  align-items: stretch;
}

.menuColumn {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.menu {
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px; /* 垂直滚动条宽度 */
  }
  &::-webkit-scrollbar-thumb {
    background: #ced0d6;
  }
}
</style>
