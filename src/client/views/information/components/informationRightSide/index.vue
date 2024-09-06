<template>
  <div class="information-right-side">
    <div class="information-right-side-content">
      <HotList />
      <PanelHot />
      <!-- <StockMarketSituation /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import HotList from "./HotList.vue";
import PanelHot from "./PanelHot.vue";
// import StockMarketSituation from "./StockMarketSituation.vue";
</script>
<style lang="scss" scoped>
.information-right-side {
  width: 350px;
  height: 100%;

  &-content {
    overflow: auto;
    height: 100%;
    padding-bottom: 36px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
