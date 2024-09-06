<template>
  <Guide
    :hidden-icp="true"
    :placeholder="videoPlaceholder"
    :AgentParams="videoTooltip"
    :create-chat-topic="createParserChat"
  >
    <template #recommend>
      <Questions />
    </template>
  </Guide>
</template>

<script setup lang="ts">
import Guide from "@/client/views/Guide.vue";
import Questions from "@/client/views/video/components/Questions.vue";
import createParserChat from "@/client/views/video/createParserChat";
import { AideKey, aideList } from "@/client/const";

const videoPlaceholder =
  "我是视频解析助手，可以根据Bilibili等常见视频网站的链接进行总结，提供高效的视频内容总结服务";
const videoTooltip = aideList.find((item) => item.key === AideKey.VIDEO_PARSE)!;
</script>

<style scoped lang="scss"></style>
