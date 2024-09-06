<template><slot /></template>
<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import useWriting from "./useWriting";
import initWritingTopicById from "./initWritingTopicById";
import { onMounted } from "vue";
import parseNumberID from "./parseNumberID";

const route = useRoute();
const router = useRouter();
const { records } = useWriting();

const updateContext = async () => {
  if (records.value.length) return;
  const topicId = parseNumberID(route.params.topicId);
  if (!topicId) return await router.replace("/writing");
  const data = await initWritingTopicById(topicId);
  if (!data) return await router.replace("/writing");
};

onMounted(updateContext);
</script>
