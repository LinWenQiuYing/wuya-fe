<template>
  <div :class="$style._">
    <template v-for="it in props.references" :key="it.uid">
      <a v-if="it.news_link" :class="$style.item" :href="it.news_link" target="_blank">
        <p :class="$style.content">{{ it.title }}</p>
        <div :class="$style.bar">
          <Favicon :src="it.news_link" />
          <span :class="$style.name">{{ getWebsiteName(it.title, it.news_link) }}</span>
          <span :class="$style.dot">·</span>
          <span :class="$style.page" :title="`第${it.document_pages}页`">{{ it.document_pages }}</span>
        </div>
      </a>
      <div v-else :class="$style.item">
        <p :class="$style.content">{{ it.title }}</p>
        <div :class="$style.bar">
          <!--      <span :class="$style.name">{{ it.document_name }}</span>-->
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { DocumentReference } from "@/client/api/chat";
import getWebsiteName from "@/client/views/writing/getWebsiteName";
import Favicon from "@/client/views/writing/Favicon.vue";

const props = defineProps<{
  references: DocumentReference[];
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  grid-auto-rows: 82px;
  grid-gap: 10px;
}

.item {
  display: grid;
  grid-template-rows: 1fr 20px;
  background: #f0f2f7;
  border-radius: 8px;
  padding: 8px 12px;
  overflow: hidden;
  align-items: center;
  color: theme.$text-color-primary;
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #f0f2f7aa;
  }
}

.content {
  font-size: 14px;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bar {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: start;
  line-height: 20px;
}

.name {
  transition: color 0.3s ease-in-out;
  margin-right: 3px;

  &:hover {
    text-decoration: underline;
    color: theme.$color-primary;
  }
}

.dot {
  user-select: none;
}

.page {
  min-width: 14px;
  height: 14px;
  text-align: center;
  padding: 0 3px;
  box-sizing: border-box;
  line-height: 14px;

  &:hover {
    background-color: #e1e2e5;
    border-radius: 12px;
  }
}
</style>
