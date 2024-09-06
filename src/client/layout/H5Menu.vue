<template>
  <div :class="$style._">
    <NavVisibilityFilter v-for="nav in h5Menu" :key="nav.path" :hidden="nav.hidden">
      <NavInterceptor v-slot="{ disabled }" :interceptor="nav.interceptor">
        <NavAlphaResolver v-slot="{ mark }" :alpha="nav.alpha">
          <NavLink
            :to="nav.path"
            :replace="isMiniProgram"
            :disabled="disabled"
            :class="[$style.link, { active: isActive(nav, route.path) }, mark]"
            @click="onChangeRoute"
          >
            <component :is="nav.icon" :class="$style.icon" />
            <span :class="$style.name">{{ nav.name }}</span>
          </NavLink>
        </NavAlphaResolver>
      </NavInterceptor>
    </NavVisibilityFilter>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import isActive from "@/utils/isActive";
import { h5Menu } from "@/client/routes";
import useClearChat from "@/store/hooks/useClearChat";
import NavVisibilityFilter from "./NavVisibilityFilter.vue";
import NavInterceptor from "./NavInterceptor.vue";
import NavLink from "./NavLink.vue";
import NavAlphaResolver from "./NavAlphaResolver.vue";
import { isMiniProgram } from "@/utils/wxUtils";

const route = useRoute();
const { clearChat } = useClearChat();

const onChangeRoute = () => {
  clearChat();
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  background: #fafafa;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
}

.link {
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 400;
  color: #676767;
  white-space: nowrap;
  transition:
    color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  line-height: 20px;
}

.icon {
  display: block;
  height: 28px;
  flex-shrink: 0;
  flex-grow: 0;
  fill: theme.$text-color-secondary;
  transition: fill 0.3s ease-in-out;
  margin: 0 4px;
}

.link:global(.active) {
  font-weight: 700;
  color: #333;

  .icon {
    fill: theme.$color-primary;
  }
}
</style>
