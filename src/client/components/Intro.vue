<template>
  <div :class="[$style._, props.inAgent && $style.agent_intro]">
    <ViewImg
      v-if="typeof props.agentType === 'string' && agentImgSrc.has(props.agentType)"
      :src="agentImgSrc.get(props.agentType)!.circle"
      :class="$style.logo"
    />
    <VisibleComFilter v-else>
      <component :is="identityIcon" :class="$style.logo" />
    </VisibleComFilter>
    <h2 :class="$style.title" v-if="props.title">{{ props.title }}</h2>
    <p :class="$style.desc">{{ description }}</p>
  </div>
</template>
<script setup lang="ts">
import LogoIcon from "@/client/icons/logo-books-name-horizontal.svg";
import { computed } from "vue";
import VisibleComFilter from "@/components/VisibleComFilter.vue";
import { agentImgSrc } from "@/components/utils";
import ViewImg from "@/components/ViewImg.vue";
import { AideKey } from "@/client/const";

const props = defineProps<{
  agentType?: AideKey;
  title?: string;
  description?: string;
  inAgent?: boolean;
}>();

const identityIcon = computed(() => props.agentType || LogoIcon);
const description = computed(() => props.description || "让知识即刻呈现，让回答值得信赖");
</script>
<style lang="scss" module>
@use "src/styles/theme";

.agent_intro._ {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;

  .logo {
    height: 63px;
  }

  .desc {
    font-size: 14px;
  }
}

._ {
  margin-bottom: 60px;
}

.logo {
  height: 40px;
  display: block;
  margin: 0 auto 5px;
}

.desc {
  font-size: 16px;
  color: theme.$text-color-secondary;
  line-height: 1.4;
  margin: 0 auto;
}

.title {
  font-weight: bold;
  font-size: 18px;
  color: #2d364d;
  font-style: normal;
  margin: 12px 0 8px;
}
</style>
