<template>
  <div :class="$style._">
    <SearchSkeleton v-if="!reference" />
    <div v-else>
      <TitleBar title="参考" :icon="SearchRestIcon" />
      <div ref="tooltipRef" :class="$style.card_wrapper">
        <el-card
          v-for="(item, index) in curShowReference"
          :key="index"
          :class="$style.card_item"
          shadow="never"
          @click="onClickReference(item)"
        >
          <el-tooltip
            :append-to="tooltipRef!"
            :popper-class="$style.popper"
            effect="light"
            :disabled="isMobile"
          >
            <template #content>
              <div :class="$style.tooltip_content">
                <div
                  :class="[$style.tooltip_title, { [$style.link]: item.news_link }]"
                  @click="onClickReference(item)"
                >
                  {{ item.title }}
                </div>
                <div :class="$style.tooltip_text">{{ item.content }}</div>
              </div>
            </template>
            <template #default>
              <div :class="$style.tooltip_inner">
                <div :class="$style.card_item_title">
                  {{ item.title }}
                </div>
                <div :class="$style.from">
                  <img
                    v-if="typeof item.favicon === 'string'"
                    :class="$style.from_image"
                    :src="item.favicon"
                    @error.once="onError"
                  />
                  <component :is="item.favicon" v-else :class="$style.icon_mimetype" />
                  <span :class="$style.from_title">
                    <span>{{ item.from_title }}</span>
                    <span :class="$style.split_dot">·</span>
                    <span>{{ index + 1 }}</span>
                  </span>
                </div>
              </div>
            </template>
          </el-tooltip>
        </el-card>
        <el-card v-show="showMoreCard" :class="$style.card_item" shadow="never" @click="onClickMore">
          <div :class="$style.more_wrapper">
            <span v-for="it in moreData.slice(0, 6)" :class="$style.more_inner">
              <img
                v-if="'favicon' in it"
                :class="$style.from_image"
                :src="it.favicon"
                @error.once="onError"
              />
            </span>
          </div>
          <div :class="$style.from_more_btn">
            <span>{{ `查看更多(${referenceData.length - 3})` }}</span>
          </div>
        </el-card>
      </div>
      <el-divider v-show="isShowAll">
        <div :class="$style.divider_content">
          <span :class="$style.divider_title">全部加载完成</span>
          <span :class="$style.divider_opera" @click="onPackup">收起</span>
        </div>
      </el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from "./TitleBar.vue";
import SearchSkeleton from "./SearchSkeleton.vue";
import { computed, ref, watch, shallowRef } from "vue";
import type { Component } from "vue";
import { getFavicon } from "@/client/views/intelligentQA/utils";
import network from "@/client/icons/globe.svg?url";
import { KNOWLEDGE_SOURCE_TITLE } from "@/client/const";
import { KnowledgeSourceType } from "@/client/types";
import SearchRestIcon from "@/client/icons/search-rest.svg";
import useClickReference from "@/client/views/intelligentQA/hooks/useClickReference";
import getReferencesIcon from "@/client/views/intelligentQA/utils/getReferencesIcon";
import store from "@/store";
import { KnowledgeData } from "@/client/types/api";
import { ReferenceState } from "@/client/types/chat";
import { isMobile } from "@/config";

const props = defineProps<{
  reference?: ReferenceState[];
  chatPosition: number;
}>();

const getKnowledgeBaseName = (sources: KnowledgeData, data: string | Record<string, number>) => {
  if (typeof data === "string") {
    return KNOWLEDGE_SOURCE_TITLE.get(data as KnowledgeSourceType);
  } else {
    if (sources.privateTree?.findIndex((item) => item.id == data?.kb_id) >= 0) {
      return KNOWLEDGE_SOURCE_TITLE.get(KnowledgeSourceType.PERSONAL);
    }
    if (sources.publicTree?.findIndex((item) => item.id == data?.kb_id) >= 0) {
      return KNOWLEDGE_SOURCE_TITLE.get(KnowledgeSourceType.ENTERPRISE);
    }
    return KNOWLEDGE_SOURCE_TITLE.get(KnowledgeSourceType.INTERNET);
  }
};

type ReferenceData = {
  favicon: string | Component;
  from_title?: string;
} & ReferenceState;
const transformData = (data: ReferenceState[] = [], sources: KnowledgeData) => {
  const result: ReferenceData[] = [];
  const moreCardData: Pick<ReferenceData, "favicon">[] = [];
  data.forEach((item, index) => {
    // 是否是新闻
    const haveFavicon = "news_link" in item;
    const favicon = haveFavicon ? getFavicon(item.news_link!) : getReferencesIcon(item);
    const from_title = haveFavicon ? item.news_source : getKnowledgeBaseName(sources, item.source);
    result.push({
      ...item,
      favicon,
      from_title,
    });
    if (index >= 3) {
      moreCardData.push({ favicon });
    }
  });
  return {
    result,
    moreCardData,
  };
};
const onError = (event: Event) => {
  const img = event.target;
  if (img && img.src !== network) {
    img.src = network;
  }
};
const isShowAll = ref(false);

const referenceData = shallowRef<ReferenceData[]>([]);
const tooltipRef = ref<HTMLElement>();
const moreData = ref<
  {
    favicon: string | Component;
  }[]
>([]);
const showMoreCard = computed(() => referenceData.value.length > 3 && !isShowAll.value);
const sources = computed(() => store.state.chat.sources);
const onClickReference = useClickReference();

const curShowReference = computed(() => {
  if (showMoreCard.value) {
    return referenceData.value.slice(0, 3);
  } else {
    return referenceData.value;
  }
});
const onClickMore = () => {
  isShowAll.value = true;
};
const onPackup = () => {
  isShowAll.value = false;
};

watch(
  [() => props.reference, () => sources.value],
  ([reference, sources]) => {
    if (reference && reference.length > 0 && sources) {
      const { result, moreCardData } = transformData(reference, sources);
      referenceData.value = result;
      moreData.value = moreCardData;
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" module>
@use "src/styles/theme";
@use "src/styles/mixins";

._ {
  :global {
    .el-divider__text {
      background-color: #f5f6fa;
    }

    .el-card__body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      border-radius: theme.$border-radius-lg;
      font-size: 14px;
      color: #2d364d;
      box-shadow: none;
    }
  }
}

.card_wrapper {
  overflow: auto;
  display: grid;
  padding-top: 4px;
  grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
  grid-auto-rows: 82px;
  grid-auto-flow: row;
  grid-gap: theme.$padding-sm;
}

.card_item {
  --el-card-bg-color: #f0f2f7;
  --el-card-padding: 8px 12px;
  display: flex;
  box-sizing: border-box;
  color: theme.$text-color-primary;
  cursor: pointer;
  border: none;
  border-radius: 8px;
}

.card_item_title {
  line-height: 20px;
  font-size: 14px;
  cursor: pointer;

  @include mixins.hide-lines(2);
}

.more_wrapper {
  display: flex;
  align-items: center;
}

.more_inner {
  padding: 4px;
}

.more_title {
  display: inline-block;
  width: 24px;
  height: 24px;
  color: theme.$text-color-primary;
  line-height: 24px;
  border-radius: 14px;
  text-align: center;
  background: #e5eaf5;
}

.from {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 125px;
  height: 24px;
  padding: 5px 0;
}

.more_btn {
  background: none;
}

.from_image {
  display: block;
  width: 16px;
  height: auto;
  margin-right: 2px;
}

.icon_mimetype {
  display: block;
  height: 20px;
  margin-right: 2px;
}

.from_title {
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  @include mixins.hide-lines(1);
}

.split_dot {
  padding: 0 2px;
}

.divider_content {
  min-width: 120px;
  font-size: theme.$font-size-base;
  color: #6d7587;
  line-height: 22px;
  font-weight: 400;
}

.divider_opera {
  padding-left: 7px;
  color: theme.$color-primary;
  cursor: pointer;
}

.tooltip_inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.from_more_btn {
  padding: 5px 0;
}

.tooltip_content {
  overflow: hidden;
  scrollbar-width: none;
  max-height: calc(300px - 32px);
}

.tooltip_title {
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  padding-bottom: 5px;
  cursor: pointer;

  &:hover {
    color: theme.$color-primary;
  }
}

.tooltip_text {
  font-size: theme.$font-size-sm;
  color: theme.$text-color-secondary;
  line-height: 20px;
}

.popper {
  padding: theme.$padding-md;
  width: 260px;
  overflow: hidden;
  border: none !important;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
}

.link {
  &:hover {
    text-decoration: underline;
  }
}
</style>
