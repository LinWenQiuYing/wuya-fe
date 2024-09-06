<template>
  <div :class="isMobile ? $style.h5 : $style.pc">
    <div :class="$style.selection" @click.stop="onClickSource">
      <template v-if="isMobile">
        <BookIcon :class="$style.library" />
        <div v-if="!allSelectedSourceTitles.length" :class="$style.placeholder">请选择知识源</div>
        <div :class="$style.label">{{ allSelectedSourceTitles }}</div>
        <ArrowDownTriangleIcon :class="$style.arrow" />
      </template>
      <template v-else>
        <div v-for="(item, index) in sourceTitle" :key="index" :class="$style.label">
          {{ item }}
        </div>
        <ArrowDownOutlineIcon :class="$style.arrow" />
      </template>
    </div>
    <div :class="[$style.mask, { hidden: !dropdownVisible }]" @click="hideDropdown" />
    <div v-show="dropdownVisible" :class="$style.dropdown">
      <template v-if="isMobile">
        <button type="button" :class="$style.close" @click.stop="hideDropdown">
          <CloseIcon />
        </button>
        <source-tooltip
          v-for="(item, index) in KNOWLEDGE_SOURCE"
          v-slot="{ disabled }"
          :key="index"
          :data="item"
        >
          <div
            :class="[$style.option, { active: selectSources.includes(item.type) }]"
            @click.stop.prevent="onClickSourceCard(item, disabled)"
          >
            <div :class="$style.title">
              <Component :is="item.icon.h5" :class="$style.sourceIcon" />
              <span>{{ item.title }}</span>
              <CheckIcon :class="[$style.checkIcon, { checked: selectSources.includes(item.type) }]" />
            </div>
            <p :class="$style.desc">{{ item.desc }}</p>
          </div>
        </source-tooltip>
      </template>
      <template v-else>
        <source-tooltip
          v-for="(item, index) in KNOWLEDGE_SOURCE"
          v-slot="{ disabled }"
          :key="index"
          :data="item"
        >
          <SourceCard
            :is-active="selectSources.includes(item.type)"
            :is-dashed="!selectSources.includes(item.type) && halfSource.includes(item.title)"
            :disabled="disabled"
            :data="item"
            @click.prevent="onClickSourceCard(item, disabled)"
          />
        </source-tooltip>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { KnowledgeSourceType } from "@/client/types";
import { KNOWLEDGE_SOURCE, KNOWLEDGE_SOURCE_TITLE, Source } from "@/client/const";
import store from "@/store";
import useTree from "@/client/hooks/useTree";
import SourceCard from "@/client/components/SourceCard.vue";
import { isMobile } from "@/config";
import ArrowDownOutlineIcon from "@/client/icons/arrow-down-outline.svg";
import ArrowDownTriangleIcon from "@/client/icons/arrow-down-triangle.svg";
import CloseIcon from "@/client/icons/xmark.svg";
import CheckIcon from "@/client/icons/circle-check.svg";
import BookIcon from "@/client/icons/book-open-radius.svg";
import SourceTooltip from "@/client/components/SourceTooltip.vue";
import useSources from "@/client/hooks/useSources";

const { clickCardSource } = useTree();
const dropdownVisible = ref<boolean>(false); // 是否打开知识源
const selectSources = computed(() => store.state.documentQA.knowledgeSource);
const checkedSources = useSources();
const halfSource = computed(() => store.state.documentQA.halfRoots);

const allSelectedSourceTitles = computed(() => {
  return selectSources.value.map((item) => KNOWLEDGE_SOURCE_TITLE.get(item)).join(", ");
});
const sourceTitle = computed(() => {
  if (selectSources.value.includes(KnowledgeSourceType.ALL)) {
    return selectSources.value.map((item) => KNOWLEDGE_SOURCE_TITLE.get(item)).slice(0, 2);
  }
  const sources = checkedSources.value.map((item) => KNOWLEDGE_SOURCE_TITLE.get(item)!);
  return [...new Set(sources.concat(halfSource.value))].slice(0, 2);
});

const hideDropdown = () => (dropdownVisible.value = false);

const onClickSource = () => {
  dropdownVisible.value = !dropdownVisible.value;
};
const onClickSourceCard = (data: Source, disabled) => {
  if (disabled) return;
  let source: KnowledgeSourceType[];
  if (data.type === KnowledgeSourceType.ALL) {
    source = [KnowledgeSourceType.ALL];
  } else {
    const sourceTypes = selectSources.value.filter((item) => item !== KnowledgeSourceType.ALL);
    if (selectSources.value.includes(data.type)) {
      source = sourceTypes.filter((item) => item !== data.type);
    } else {
      source = [...sourceTypes, data.type];
    }
    const internetIdx = source.findIndex((name) => name === KnowledgeSourceType.INTERNET);
    if (internetIdx !== -1) {
      source.splice(internetIdx, 1);
      source.push(KnowledgeSourceType.INTERNET);
    }
  }
  store.commit("documentQA/SET_KNOWLEDGE_SOURCE", source);
  clickCardSource(source);
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

.placeholder {
  font-size: 12px;
  color: theme.$text-color-secondary;
  line-height: 26px;
  font-weight: 400;
}

.pc .label {
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  padding: 0 theme.$padding-xs;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  font-weight: 400;
  background-color: theme.$color-white;
  margin-right: theme.$margin-xss;
}

.h5 .label {
  font-weight: 400;
  font-size: 12px;
  color: #2d364d;
  line-height: 17px;
  text-shadow: 0 2px 6px rgba(215, 213, 213, 0.12);
}

.library {
  width: 14px;
  fill: currentColor;
  display: block;
  margin-right: 5px;
}

.arrow {
  transition: fill 0.3s ease-in-out;
}

.pc .arrow {
  margin-left: auto;
  flex: 0 0 16px;
  width: 16px;
  fill: theme.$text-color-primary;
}

.h5 .arrow {
  width: 10px;
  fill: #bbb;
  margin-left: 5px;
}

.selection {
  display: flex;
  align-items: center;
  height: 30px;
  min-width: 52px;
  line-height: 30px;
  border-radius: 15px;
  cursor: pointer;

  &:hover .arrow {
    fill: theme.$color-primary;
  }
}

.pc .selection {
  padding: 0 theme.$padding-xss;
  background: #edeff3;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pc {
  .mask {
    background: transparent;
  }

  .dropdown {
    position: absolute;
    z-index: 2;
    top: calc(100% + 4px);
    left: 0;
    width: 700px;
    padding: theme.$padding-md;
    background: theme.$color-white;
    box-shadow: 0 6px 14px 0 rgba(45, 54, 77, 0.1);
    border-radius: theme.$border-radius-xxl;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 76px;
    grid-auto-flow: row;
    grid-gap: theme.$padding-xs;
    transition: all 0.3s;
  }
}

.h5 {
  .mask {
    background: rgba(0, 0, 0, 0.6);
  }

  .dropdown {
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 10px 15px 0;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px 8px 0 0;
    overflow-y: auto;
  }
}

.mask:global(.hidden) {
  display: none;
}

.close {
  width: 44px;
  height: 44px;
  padding: 0;
  box-sizing: border-box;
  border: 0 none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: 0 none;
  margin-left: auto;
  margin-right: -15px;
  color: #404040;

  > svg {
    width: 20px;
    display: block;
    fill: currentColor;
  }
}

.sourceIcon {
  display: block;
  width: 14px;
  color: theme.$text-color-secondary;
  fill: currentColor;
  margin-right: 8px;
  transition: color 0.3s ease-in-out;
}

.title {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 6px;
  transition: color 0.3s ease-in-out;
}

.checkIcon {
  display: block;
  width: 17px;
  margin-left: auto;
  fill: #fff;
  --stroke-color: #c4c4c4;
  transition:
    fill 0.3s ease-in-out,
    --stroke-color 0.3s ease-in-out;

  &:global(.checked) {
    --stroke-color: theme.$color-primary;
    fill: theme.$color-primary;
  }
}

.radio {
  margin-left: auto;

  &:global(.el-radio__label:empty) {
    display: none;
  }
}

.desc {
  font-weight: 400;
  font-size: 12px;
  color: theme.$text-color-secondary;
  line-height: 20px;
}

.option {
  padding: 12px 0;
  color: theme.$text-color-primary;

  &:global(.active) {
    color: theme.$color-primary;

    .sourceIcon {
      color: inherit;
    }
  }

  & + & {
    border-top: 1px solid #f2f2f2;
  }
}
</style>
