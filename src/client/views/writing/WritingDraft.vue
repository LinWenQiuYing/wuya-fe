<template>
  <div v-if="draft && topicId && recordId" :class="$style._">
    <ChatHeader :class="$style.header" />
    <div :class="$style.body">
      <DraftEditor :class="$style.box" :draft="draft" :topic-id="topicId" :record-id="recordId" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatHeader from "@/client/views/intelligentQA/components/ChatHeader.vue";
import { createWritingDraft, Draft, getWritingDraft } from "@/client/api/chat";
import DraftEditor from "./DraftEditor.vue";
import parseNumberID from "./parseNumberID";

const router = useRouter();
const route = useRoute();

const topicId = parseNumberID(route.params.topicId);
const recordId = parseNumberID(route.params.recordId);

const draft = shallowRef<Draft>();

const updateContext = async () => {
  if (!topicId) return await router.replace("/writing");
  if (!recordId) return await router.replace(`/writing/topic/${topicId}`);

  const draftId = parseNumberID(route.params.draftId);
  if (draft.value) return;
  const data = draftId
    ? await getWritingDraft({ record_id: recordId, draft_id: draftId }).catch(console.error)
    : await createWritingDraft({ topic_id: topicId, record_id: recordId }).catch(console.error);

  // 上面接口加载出错的时候, data为空
  if (!data) return await router.replace(`/writing/topic/${topicId}`);
  draft.value = data;

  // 新建草稿的时候, 开始时会没有draftId, 需要将draftId写到地址栏中
  if (!draftId) {
    await router.replace(`/writing/topic/${topicId}/record/${recordId}/draft/${data.id}`);
  }
};

onMounted(updateContext);
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.header {
  flex-shrink: 0;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
}

.body {
  background: #fff;
  border-top-left-radius: 14px;
  overflow: hidden;
}

.box {
  margin: 0 auto;
  height: 100%;
  max-width: 1100px;
  padding: 0 32px;
}
</style>
