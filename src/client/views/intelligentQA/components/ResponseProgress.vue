<!--回答进度-->
<template>
  <div v-if="showProgress" :class="[isMobile ? $style.h5 : $style.pc, { folded: isFold }, $style._]">
    <div :class="$style.progress_header" @click="onClick">
      <TitleBar
        :class="[$style.progress_title]"
        :title="isAnimationTitle ? props.title : getFoldStrAndTitle?.[0]"
        :icon="getTitleIcon"
        :animated="isAnimationIcon"
      />
      <div :class="$style.header_right">
        <template v-if="!isMobile">
          <div v-show="isFold && lastProgress" :class="$style.header_right_title">
            <div v-if="lastProgress?.data && keyWord" :class="$style.keyword_wrapper">
              <span :class="$style.key_title">
                {{ keyWord }}
              </span>
            </div>
            <div v-else-if="getFoldStrAndTitle?.[1]" v-html="getFoldStrAndTitle[1]" />
          </div>
        </template>
        <span :class="$style.arrow"><ArrowUp :class="$style.arrow_icon" /></span>
      </div>
    </div>
    <div :class="$style.progress_wrapper">
      <div
        v-for="(item, index) in progressData"
        :key="index"
        :class="typeof item === 'string' ? $style.line_progress : $style.line_keywords"
      >
        <template v-if="typeof item === 'string'">
          <CircleRecycleIcon v-if="isProgress(index)" :class="$style.icon" />
          <CircleCheckIcon v-else :class="$style.icon" />
        </template>
        <div v-if="typeof item === 'string'" v-html="getNumStr(item)" />
        <div v-else-if="typeof item === 'object' && 'outline' in item">
          <div :class="[$style.outline]" :data-hidden="props.hidden" v-html="item.outline"></div>
        </div>
        <!--数据分析-->
        <div v-else-if="typeof item === 'object' && 'agent' in item">
          <div :class="[$style.outline]" v-html="item.agent" />
        </div>
        <div v-else :class="$style.keyword_wrapper">
          <span v-for="(key, i) in item" :key="i" :class="$style.key_title" :title="key">
            {{ key }}
          </span>
        </div>
      </div>
      <CompanyConfirm
        :class="$style.line_keywords"
        :data="props.chatdata"
        v-if="'preCheckConfirms' in props.chatdata.answer"
      />
    </div>
    <el-progress
      v-if="isProgressTitle && state !== 'succeed'"
      :percentage="progressVal"
      color="#086DF4"
      :show-text="false"
      :class="$style.progress_bottom"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ArrowUp } from "@element-plus/icons-vue";
import TitleBar from "@/client/views/intelligentQA/components/TitleBar.vue";
import ParagraphIcon from "@/client/icons/paragraph.svg";
import CircleRecycleIcon from "@/client/icons/circle-recycle.svg";
import CircleCheckIcon from "@/client/icons/circle-check.svg";
import useMarkdown from "@/client/hooks/useMarkdown";
import { isMobile } from "@/config";
import { AnalysisRecordState, ChatDataState, ChatProgressState } from "@/client/types/chat";
import { useRoute } from "vue-router";
import { AideKey } from "@/client/const";
import CompanyConfirm from "@/client/views/intelligentQA/components/CompanyConfirm.vue";

interface ProgressDataState {
  outline?: string;
  agent?: string;
}

const props = defineProps<{
  chatdata: ChatDataState;
  title: string;
  // 对隐藏元素的描, 如 "h1", "h1,h2"
  readonly hidden?: string;
  readonly show?: boolean;
}>();
let timer: number;
const route = useRoute();
const markdown = useMarkdown();
const keyWord = ref<string>("");
const state = ref<"loading" | "succeed" | "">("");
const isFold = ref<boolean>(true);

const showProgress = computed(() => {
  if (props.show) return true;
  return props.chatdata.answer.isProgress ? true : !props.chatdata.answer.answerStop;
});

// 当前路由是否支持进度展示
const isProgressTitle = computed(() => {
  const path = route.path.split("/")[1];
  return (
    ["qa", "new", "writing", "survey", "contract", "parser", "customer_service"].includes(path) &&
    ![AideKey.DATA_ANALYSIS, AideKey.FINANCIAL_ANALYSIS].includes(props.chatdata.answer.agentType)
  );
});

const isAnimationTitle = computed(
  () => !isProgressTitle.value || (props.chatdata.answer.isProgress && state.value !== "loading"),
);
const isAnimationIcon = computed(() => isProgressTitle.value && !props.chatdata.answer.isProgress);
const progressData = computed(() => {
  const progress: Array<string | string[] | ProgressDataState> = [];
  if ("preCheckConfirms" in props.chatdata.answer) {
    progress.push("找到以下相关的公司，请确认企业名称以开始尽调分析");
  } else if (props.chatdata.answer?.progress) {
    props.chatdata.answer.progress.forEach((item) => {
      if (typeof item === "object" && !Array.isArray(item)) {
        progress.push(item.complete_message ?? item.action);
        item.data && progress.push(item.data);
      } else {
        progress.push(item);
      }
    });
  }
  //数据分析过程
  if ((props.chatdata.answer as AnalysisRecordState).agent) {
    progress.splice(2, 0, { agent: markdown.render((props.chatdata.answer as AnalysisRecordState).agent!) });
  }
  return progress;
});

const progressVal = computed(() => {
  if (!props.chatdata.answer.progress) return 0;
  const avg = 100 / 4; // 最多只有四步
  const resolveStep = props.chatdata.answer.progress.length;
  if (resolveStep < 1) return 10;
  if (props.chatdata.answer.isProgress) return 100;
  return resolveStep * avg;
});

const completeFn = () => {
  state.value = "loading";
  setTimeout(() => (state.value = "succeed"), 1000);
};

watch(
  () => props.chatdata.answer.isProgress,
  (isProgress) => {
    if (isProgress) {
      isFold.value = true;
      if (isProgressTitle.value) completeFn();
    } else {
      isFold.value = false;
    }
  },
  {
    immediate: true,
  },
);

const lastProgress = computed(() => {
  if (!props.chatdata.answer.progress?.length) return "";
  return props.chatdata.answer.progress[props.chatdata.answer.progress.length - 1];
});

const getTitleIcon = computed(() => {
  if (!props.chatdata.answer.isProgress && isProgressTitle.value) {
    return CircleRecycleIcon;
  } else if (state.value === "loading") {
    return CircleCheckIcon;
  } else {
    return ParagraphIcon;
  }
});

const getFoldStrAndTitle = computed(() => {
  if (!lastProgress.value) return ["分析问题"];
  const isProgress = props.chatdata.answer.isProgress;
  if (typeof lastProgress.value === "string") {
    switch (lastProgress.value) {
      case "分析需求":
      case "分析问题":
        return ["分析问题", "正在提炼关键字"];
      case "生成大纲":
        return [isProgress ? "完成" : "生成大纲", isProgress ? "" : "大纲编写中"];
      default:
        return [isProgress ? "完成" : "搜索中", getNumStr(lastProgress.value)];
    }
  }
  const progress = lastProgress.value as ChatProgressState;
  if (progress?.data && !keyWord.value) {
    showKeyWord(progress.data);
  }
  return [progress.action, getNumStr(progress.active_message || "")];
});

const showKeyWord = (progressArr: string[], idx: number = 0) => {
  if (!progressArr[idx]) {
    clearTimeout(timer);
    return;
  }
  keyWord.value = progressArr[idx];
  timer = window.setTimeout(() => {
    showKeyWord(progressArr, idx + 1);
  }, 1000);
};

const getNumStr = (str: string) => {
  return str.replace(/`?(\d+(\.\d+)?)`?/g, (match, p1) => {
    return `<span style="color: #086DF4"> ${p1} </span>`;
  });
};

const onClick = () => {
  isFold.value = !isFold.value;
};

const isProgress = (index: number) => {
  const strIdx = progressData.value.reduce((pre, cur, idx) => {
    if (typeof cur === "string") {
      pre.push(idx);
    }
    return pre;
  }, [] as number[]);
  if (strIdx[strIdx.length - 1] === index) {
    return !props.chatdata.answer.isProgress;
  }
  return false;
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

._ {
  position: relative;
  padding: 0 15px;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  font-weight: 400;
  height: fit-content;
  max-height: 100000px;
  overflow-y: hidden;
  //transition: all 0.5s ease-in-out;

  &:global(.folded) {
    max-height: 44px;
  }
}

.pc {
  border: 1px solid #d6dae6;
  border-radius: theme.$border-radius-xxl;
}

.h5 {
  background: #f4f4f8;
  border-radius: 4px;
}

.header_right {
  display: flex;
  align-items: center;
}

.header_right_title {
  height: 30px;
  line-height: 30px;
  padding-right: theme.$padding-md;
  font-size: 12px;
  color: #4448518a;
}

.progress_bottom {
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
}

.arrow {
  width: 16px;
  height: 16px;
  box-sizing: content-box;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;

  &:hover {
    background: theme.$background-color-base;
  }

  .arrow-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  @at-root ._:global(.folded) & {
    transform: rotateX(180deg);
  }
}

.line_progress {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.icon {
  fill: theme.$text-color-primary;
  width: 18px;
  height: auto;
  margin-right: 8px;

  &:global(.rotate) {
    animation: rotate 1.2s linear infinite;
  }
}

// 每个关键词需要的外边距, 包含水平和垂直外边距
$breath-keyword: 3px;

.line_keywords {
  // 通过负(左, 上)负外边距, 保证每个关键词块有呼吸的空间 及 可以左对齐
  margin: -$breath-keyword 0 0 (25px - $breath-keyword);
}

.keyword_wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  box-sizing: border-box;
}

.key_title {
  display: -webkit-box;
  min-width: 80px;
  max-width: 200px;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  background-color: #e6f5ff;
  color: #086df4;
  padding: 0 8px;
  font-size: 14px;
  cursor: default;
  margin: $breath-keyword;
}

.progress_wrapper {
  position: relative;

  &::before {
    position: absolute;
    content: " ";
    border-left: 4px dotted;
    height: calc(100% - 40px);
    left: 7px;
    top: 20px;
  }

  @at-root .pc &::before {
    border-left-color: #e0e4f1;
  }

  @at-root .h5 &::before {
    border-left-color: #dedede;
  }
}

.progress_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .progress_title {
    height: 42px;
    font-weight: 500;
    margin-left: -2px;
  }
}

.outline {
  padding-bottom: 10px;
  font-size: 12px;

  :global {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    ul,
    li,
    ol {
      font-weight: 500;
      margin-bottom: 5px;
      font-size: 12px;
    }

    pre {
      //white-space: pre-wrap;
      //word-wrap: break-word;
      display: flex;
      flex-direction: column;
      width: 100%;
      //max-width: 600px;
      border: none;
      border-radius: 6px;
      background-color: #f8f9fb;
      overflow-x: auto;
    }

    pre code {
      background-color: #f8f9fb !important;
      padding: 10px 12px;
      font-size: 14px;
      line-height: 16px;
      text-align: left;
      font-style: normal;
    }

    .code-box {
      display: flex;
      width: 100%;
      padding-right: 16px;

      ul,
      li {
        list-style: none;
        margin-bottom: 0;
        padding-inline-start: 0;
      }
    }

    .line-box {
      padding: 10px 0;
      margin-left: 10px;
      color: #999999;
      font-size: theme.$background-color-base;
      line-height: 16px;
      text-align: left;
    }

    .tool-box {
      background: #f0f2f7;
      color: #2d364d;
      height: 36px;
      padding: 0 10px;
      border-radius: 4px 4px 0 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: theme.$font-size-sm;

      .code-lang {
        flex: auto;
        font-weight: normal;
        font-size: 14px;
        color: #2d364d;
      }

      .toolbar {
        display: flex;
        align-items: center;
        padding-left: 4px;
        cursor: pointer;

        img {
          width: 16px;
          height: auto;
          padding-right: 4px;
        }
      }
    }
  }

  &[data-hidden*="h1"] h1 {
    display: none;
  }

  &[data-hidden*="p"] p {
    display: none;
  }

  table {
    margin: 16px 0;
    display: block;
    overflow-x: auto;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    white-space: nowrap;
  }

  th {
    font-weight: 500;
    font-size: 14px;
    color: #6d7587;
    background: #f0f2f7;
  }

  td,
  th {
    padding: 5px 10px;
    border: 1px solid #dddfe3;
  }
}
</style>
