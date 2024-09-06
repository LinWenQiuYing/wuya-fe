<template>
  <template v-if="route.meta.hidden != 'setting'">
    <button v-if="!isUnSigned" type="button" :class="[props.class, $style.btn]" @click="showAside">
      <MenuIcon />
    </button>
    <LoginGuide v-else :class="props.class" />
  </template>
  <div v-show="asideVisible" :class="$style.mask" @click.self="hideAside">
    <H5Aside v-model:visible="asideVisible" :class="$style.aside" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import MenuIcon from "@/client/icons/list-dot.svg";
import H5Aside from "./H5Aside.vue";
import LoginGuide from "./components/H5LoginGuide.vue";
import { isUnSigned } from "@/store/hooks/useUserInfo";

const props = defineProps<{
  readonly class?: string;
}>();

const route = useRoute();
const asideVisible = ref<boolean>(false);

const showAside = () => (asideVisible.value = true);

const hideAside = () => (asideVisible.value = false);
</script>
<style lang="scss" module>
.btn {
  border: 0 none;
  box-shadow: none;
  outline: 0 none;
  background-color: unset;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  > svg {
    width: 16px;
    display: block;
    margin: auto;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgb(0 0 0 / 60%);
}

.aside {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #fff 100%, #fff 100%);
  border-radius: 0 8px 8px 0;
  margin-right: 50px;
  height: 100%;
  position: relative;
  z-index: 3;
}
</style>
