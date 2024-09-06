<template>
  <div :class="$style.container">
    <div :class="$style.nav">
      <Logo to="/admin" :compact="true" :class="$style.logo" />
      <SideMenu />
    </div>
    <div :class="$style.main">
      <Header />
      <div :class="$style.content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import SideMenu from "./components/SideMenu.vue";
import Logo from "@/components/Logo.vue";
</script>

<style lang="scss" module>
@use "src/styles/theme";

.container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.nav {
  background: #f0f3fa;
  padding: 8px 0;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.logo {
  margin: 8px 0;
}

.main {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.content {
  flex: 1;
  background: #f6f8fe;
  overflow: hidden auto;
}
</style>
