<template>
  <div :class="$style._">
    <div :class="$style.main">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </div>
    <AsideDynamicVisibleFilter>
      <AsideConfigVisibleFilter>
        <H5Menu :class="$style.menu" />
        <H5AsideContext :class="$style.aside" />
      </AsideConfigVisibleFilter>
    </AsideDynamicVisibleFilter>
  </div>
</template>
<script lang="ts" setup>
import H5Menu from "./H5Menu.vue";
import H5AsideContext from "./H5AsideContext.vue";
import AsideDynamicVisibleFilter from "./AsideDynamicVisibleFilter.vue";
import AsideConfigVisibleFilter from "./AsideConfigVisibleFilter.vue";
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 100%;
  height: 100%;
  background: linear-gradient(163deg, #f8f7fe 0%, #fffbfd 52%, #fff 100%, #fff 100%);
  position: relative;
  z-index: 0;
}

.main {
  overflow-y: auto;
  height: calc(100% - 56px - env(safe-area-inset-bottom));

  &::-webkit-scrollbar {
    display: none;

    &:hover {
      display: block;
    }
  }
}

.menu {
  border-top: 1px solid #eee;
  z-index: -1;
  position: fixed;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  height: calc(56px + env(safe-area-inset-bottom));
}

.aside {
  position: fixed;
  left: 0;
  top: 0;
  margin: 13px 0 0 5px;
}
</style>
