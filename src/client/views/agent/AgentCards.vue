<template>
  <agent-cards-wrapper>
    <AgentCard v-for="(item, index) in aideList" :key="index" :item="item" @click="goExactAides(item)" />
  </agent-cards-wrapper>
</template>
<script setup lang="ts">
import AgentCard from "./AgentCard.vue";
import AgentCardsWrapper from "./AgentCardsWrapper.vue";
import { useRouter } from "vue-router";
import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import { AgentItem, aideList } from "@/client/const";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import reAuth from "@/sign/reAuth";

const router = useRouter();
const { defaultAgentType, setDefaultAgentType } = useDefaultAgentType();
const goExactAides = async (item: AgentItem) => {
  if (isAnonymous.value) {
    // 不需要调用退出接口
    return reAuth().catch(console.error);
  }
  if (item.notOnline) return;
  const list = defaultAgentType.value || [];
  if (!list.includes(item.key)) {
    await setDefaultAgentType(list.concat(item.key));
  }
  await router.push(item.path);
};
</script>
