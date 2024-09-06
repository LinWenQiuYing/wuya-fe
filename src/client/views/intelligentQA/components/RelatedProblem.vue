<template>
  <div class="related-problem">
    <TitleBar :title="props.title" :icon="SearchingIcon" />
    <div class="questions">
      <ChatQuestion v-for="(item, index) in data" :key="index" :data="item" :click="props.send" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatQuestion from "@/client/views/intelligentQA/components/ChatQuestion.vue";
import TitleBar from "@/client/views/intelligentQA/components/TitleBar.vue";
import { computed } from "vue";
import SearchingIcon from "@/client/icons/searching.svg";

const props = defineProps<{
  questions: string[];
  send?: (query: string) => void;
  title: string;
}>();
const data = computed(() => props.questions);
</script>
