<template>
  <VisibleComFilter>
    <router-link
      :to="to"
      :class="$style._"
      active-class=""
      exact-active-class=""
      title="吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！"
    >
      <template v-if="target.isElectron && props.titleVisible">
        <img :class="$style.pc" src="./images/logo-infinity-aipc.png" alt="Infinity logo" />
      </template>
      <template v-else>
        <LogoIcon :class="$style.infinity" />
        <span v-if="props.titleVisible" :class="$style.title">Infinity</span>
      </template>
    </router-link>
  </VisibleComFilter>
</template>

<script lang="ts" setup>
import LogoIcon from "@/client/icons/logo.svg";
import { target } from "@/config";
import VisibleComFilter from "@/components/VisibleComFilter.vue";

const props = defineProps<{
  titleVisible?: boolean;
  readonly to?: string;
}>();

const to = props.to ?? "/";
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: center;
}

.infinity {
  display: block;
  width: 40px;
  margin: 5px 8px;
}

.pc {
  width: 190px;
  margin-right: auto;
}

.title {
  font-size: theme.$font-size-xxl;
  color: theme.$text-color-primary;
  font-weight: 700;
  cursor: default;
  margin-right: auto;
}
</style>
