<template>
  <Guide
    :hidden-icp="true"
    :placeholder="videoPlaceholder"
    :AgentParams="videoTooltip"
    :create-chat-topic="createServiceChat"
  >
    <template #recommend>
      <Questions />
    </template>
  </Guide>
</template>

<script setup lang="ts">
import Guide from "@/client/views/Guide.vue";
import Questions from "@/client/views/customerService/components/Questions.vue";
import createServiceChat from "@/client/views/customerService/createServiceChat";
import { AideKey, aideList } from "@/client/const";

const videoPlaceholder = "我是无涯客服，请输入您的产品疑问";
const videoTooltip = aideList.find((item) => item.key === AideKey.CUSTOMER_SERVICE)!;
</script>
