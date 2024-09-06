<template>
  <div :class="[$style._, $style[imgGradientClassName]]">
    <ViewImg v-if="imgState" :src="imgState.background" :class="$style.icon" />
    <h1 :class="$style.title">
      {{ props.item.name }}
    </h1>
    <p :class="$style.introduce">
      {{ props.item.description }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { AgentItem, AideKey } from "@/client/const";
import { agentImgSrc } from "@/components/utils";
import ViewImg from "@/components/ViewImg.vue";
import { computed } from "vue";

const props = defineProps<{ item: AgentItem }>();
const imgState = agentImgSrc.get(props.item.key);

const imgGradientClassName = computed(() => {
  switch (props.item.key) {
    case AideKey.CONTRACT_AUDIT:
      return "audit_bg";
    case AideKey.DATA_ANALYSIS:
      return "analysis_bg";
    case AideKey.ENTERPRISE_RESEARCH:
      return "survey_bg";
    case AideKey.VIDEO_PARSE:
      return "video_bg";
    case AideKey.FINANCIAL_ANALYSIS:
      return "financial_bg";
    case AideKey.CUSTOMER_SERVICE:
      return "customer_service_bg";
    default:
      return "";
  }
});
</script>
<style module lang="scss">
@use "src/styles/theme";
@import "src/styles/mixins";

._ {
  position: relative;
  width: 210px;
  height: 263px;
  border-radius: 8px;
  padding: 28px 10px 0;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px 0 #0000000d;
  }

  &:active {
    opacity: 0.7;
  }
}

.analysis_bg {
  background: linear-gradient(179deg, #ffffff 0%, #e6f0fa 35%, #6da9e4 100%);
}

.survey_bg {
  background: linear-gradient(179deg, #ffffff 0%, #e6f0fa 35%, #6762cf 100%);
}

.audit_bg {
  background: linear-gradient(179deg, #ffffff 0%, #e6f0fa 35%, #fcc7a0 100%);
}

.video_bg {
  background: linear-gradient(179deg, #ffffff 0%, #f4e2ec 53%, #ee89ce 100%);
}

.financial_bg {
  background: linear-gradient(179deg, #ffffff 0%, #fff4f3 52%, #e7aaa3 100%);
}

.customer_service_bg {
  background: linear-gradient(179deg, #ffffff 0%, #e6f0fa 35%, #bad88a 100%);
}
.icon {
  position: absolute;
  z-index: 1;
  width: 100%;
  bottom: 0;
  left: 0;
}

.title {
  height: 28px;
  font-weight: bold;
  font-size: theme.$font-size-lg;
  color: theme.$text-color-primary;
}

.introduce {
  height: 36px;
  max-width: 100%;
  font-size: theme.$font-size-base;
  color: theme.$text-color-secondary;
  @include hide-lines(2);
}
</style>
