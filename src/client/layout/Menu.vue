<template>
  <div :class="[menuStyle, $style._]">
    <NavVisibilityFilter v-for="nav in menu" :key="nav.path" :hidden="nav.hidden">
      <NavAlphaResolver v-slot="{ mark }" :alpha="nav.alpha">
        <NavInterceptor v-slot="{ disabled }" :interceptor="nav.interceptor">
          <NavLink
            :to="nav.path"
            :disabled="disabled"
            :class="[$style.link, { active: isActive(nav, route.path), disabled }, mark]"
            :style="getNavOrderStyle(nav.order)"
            @click="onChangeRoute"
          >
            <component :is="nav.icon" :class="$style.icon" />
            <span>{{ nav.name }}</span>
          </NavLink>
        </NavInterceptor>
      </NavAlphaResolver>
    </NavVisibilityFilter>
    <NavTooltipBtn v-for="(item, index) in agentMenus" :key="index" :menu-class="menuStyle" :item="item">
      <template v-slot="{ moveAgent }">
        <router-link
          :key="item.path"
          :to="item.path"
          :class="[
            $style.link,
            { active: isActive(item, route.path), top_line: isFirst(index), bottom_line: isFast(index) },
          ]"
          exact-active-class=""
          active-class=""
          @click="onChangeRoute"
        >
          <ViewImg
            v-if="agentImgSrc.has(item.key)"
            :src="agentImgSrc.get(item.key)!.circle"
            :class="$style.icon"
          />
          <MinusCircleIcon :class="$style.move_agent" @click.prevent="moveAgent(item.key)" />
          <span>{{ item.menuNAme }}</span>
        </router-link>
      </template>
    </NavTooltipBtn>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

import isActive from "@/utils/isActive";
import { menu } from "@/client/routes";
import useClearChat from "@/store/hooks/useClearChat";
import { isMobile } from "@/config";
import getPlatformConfig from "@/utils/getPlatformConfig";
import { defaultMenuStyle } from "@/router";
import NavVisibilityFilter from "./NavVisibilityFilter.vue";
import NavInterceptor from "./NavInterceptor.vue";
import NavLink from "./NavLink.vue";
import NavAlphaResolver from "./NavAlphaResolver.vue";
import NavTooltipBtn from "@/client/layout/NavTooltipBtn.vue";
import MinusCircleIcon from "@/client/icons/minus_circle.svg";
import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import { aideList } from "@/client/const";
import { agentImgSrc } from "@/components/utils";
import ViewImg from "@/components/ViewImg.vue";

const route = useRoute();
const { clearChat } = useClearChat();
const { defaultAgentType } = useDefaultAgentType();

const crossPlatformMenuStyle = computed(() => route.meta.menuStyle ?? defaultMenuStyle);
const h5MenuStyle = computed(() => getPlatformConfig(crossPlatformMenuStyle.value, "h5") ?? defaultMenuStyle);
const pcMenuStyle = computed(() => getPlatformConfig(crossPlatformMenuStyle.value, "pc") ?? defaultMenuStyle);
const menuStyle = computed(() => (isMobile ? h5MenuStyle.value : pcMenuStyle.value));
const agentMenus = computed(() => aideList.filter((item) => defaultAgentType.value.includes(item.key)));
const onChangeRoute = () => {
  clearChat();
};

const getNavOrderStyle = (order?: number) => {
  return order ? { order } : null;
};
const isFirst = (index: number) => menuStyle.value === "cubed" && index === 0;
const isFast = (index: number) => menuStyle.value === "cubed" && index === agentMenus.value.length - 1;
</script>

<style lang="scss" module>
@use "src/styles/theme";

.icon {
  display: block;
  height: 26px;
  flex-shrink: 0;
  flex-grow: 0;
  fill: rgba(theme.$text-color-secondary, 0.8);
  transition: fill 0.3s ease-in-out;
  margin: 0 4px;
}

.link {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: theme.$text-color-primary;
  white-space: nowrap;
  line-height: 20px;
  transition:
    color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;

  &:global(.active) {
    background: #fff;
    font-weight: 700;
  }

  &:hover:not(:global(.disabled)) {
    color: #000;
  }

  &:hover:not(:global(.disabled)),
  &:global(.active) {
    .icon {
      fill: theme.$color-primary;
    }
  }
}

:global(.cubed) {
  &._ {
    width: 68px;
    display: flex;
    flex-direction: column;
  }

  > .link {
    border-radius: 5px;
    margin: 5px 6px;
    padding: 7px 5px;
  }
}

:global(.tiled) {
  &._ {
    width: 240px;
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }

  > .link {
    border-radius: 20px;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    padding: 10px 16px;
    margin: 12px;

    &:hover {
      background-color: #fff;

      .move_agent {
        display: block;
        right: 15px;
      }
    }
  }
}

:global(.top_line) {
  border-top: 2px solid #f1f2f7;
}

:global(.bottom_line) {
  border-bottom: 2px solid #f1f2f7;
}
.move_agent {
  position: absolute;
  display: none;
  width: 16px;
}
</style>
