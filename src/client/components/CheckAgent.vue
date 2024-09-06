<template>
  <div :class="$style.check_agent" v-if="checkAgent">
    <div :class="$style.txt">
      <span>和</span>
      <ViewImg
        v-if="agentImgSrc.has(checkAgent)"
        :src="agentImgSrc.get(checkAgent)!.circle"
        :class="$style.agent_icon"
      />
      <span :class="$style.name">{{ getAgentItem(checkAgent)!.name }}</span>
      <span>对话</span>
    </div>
    <Close :class="$style.btn_icon" @click="clearAgent" />
  </div>
</template>

<script setup lang="ts">
import getAgentItem from "@/client/utils/getAgentItem";
import { Close } from "@element-plus/icons-vue";
import { computed } from "vue";
import store from "@/store";
import { agentImgSrc } from "@/components/utils";
import ViewImg from "@/components/ViewImg.vue";

const checkAgent = computed(() => store.state.agent.type);
const clearAgent = () => {
  store.commit("agent/SET_TYPE", "");
};
</script>

<style module lang="scss">
.check_agent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0;
  background: #f0f2f7;
  border-radius: 5px 5px 0px 0px;
  font-size: 14px;
}

.btn_icon {
  width: 20px;
}

.txt {
  display: flex;
  align-items: center;
  padding: 6px 0;
}

.agent_icon {
  width: 24px;
  border-radius: 50%;
  margin: 0 1px;
}
.name {
  font-weight: bold;
  font-size: 14px;
  color: #2d364d;
  margin: 0 1px;
}
</style>
