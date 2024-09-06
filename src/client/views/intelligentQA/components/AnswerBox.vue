<template>
  <div ref="answerRef" :class="$style.answer_box">
    <AnswerSkeleton
      v-show="![AideKey.DATA_ANALYSIS, AideKey.FINANCIAL_ANALYSIS].includes(props.agentType)"
      v-if="!content && !stopTxt"
    />
    <answer-translate-wrapper
      v-else
      v-model:language="language"
      v-model:visible="showTranslation"
      :answer="answer"
      :reference="props.reference"
    >
      <TitleBar title="回答" :icon="BubbleIcon" :animated="!props.showOperation && !stopTxt" />
      <div ref="contentRef">
        <Markdown :hidden="props.hidden" :html="(markdownData || '') + stopTxt" @mousemove="onMousemove" />
      </div>
      <div v-show="showOperation || stopTxt" :class="$style.answer_box_bottom">
        <answer-copy v-if="showOperation" :reference="props.reference" :content-ref="contentRef" />
        <answer-refresh
          v-if="!props.hiddenRebuild && [AideKey.NO_AGENT].includes(agentType)"
          :question="props.question"
        />
        <slot name="rebuild" class="operation"></slot>
        <answer-translate
          v-if="activeModule !== 'writing'"
          v-model:visible="showTranslation"
          v-model:language="language"
        />
        <AnswerLike
          v-if="showOperation && !props.hiddenVote"
          v-model:vote-down="voteDown"
          v-model:vote-up="voteUp"
          :class="[voteUp && $style.active]"
          title="赞"
          @on-vote-up="() => onVoteUp(props.recordId)"
        />
        <AnswerDislike
          v-if="showOperation && !props.hiddenVote"
          v-model:vote-down="voteDown"
          :record-id="props.recordId"
          :vote-down-comment="voteDownComment"
          :on-vote-down="onVoteDown"
        />
      </div>
    </answer-translate-wrapper>
    <transition name="tooltip">
      <div
        v-show="showTooltip"
        ref="tooltipRef"
        :class="$style.tooltip"
        @mouseenter.stop="showTooltip = true"
      >
        <div :class="$style.tooltip_content">
          <div
            :class="[$style.tooltip_title, { [$style.link]: curReference?.news_link }]"
            @click="onClickReference(curReference)"
          >
            {{ curReference?.title }}
          </div>
          <div :class="$style.tooltip_text">{{ curReference?.content }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TitleBar from "./TitleBar.vue";
import AnswerSkeleton from "./AnswerSkeleton.vue";
import BubbleIcon from "@/client/icons/bubble.svg";

import useMarkdown from "@/client/hooks/useMarkdown";
import "highlight.js/styles/a11y-light.css";
import { AideKey } from "@/client/const";
import AnswerCopy from "./AnswerCopy.vue";
import AnswerRefresh from "./AnswerRefresh.vue";
import AnswerTranslateWrapper from "./AnswerTranslateWrapper.vue";
import AnswerTranslate from "./AnswerTranslate.vue";
import useClickReference from "@/client/views/intelligentQA/hooks/useClickReference";
import useActiveModule from "@/client/layout/useActiveModule";
import Markdown from "./Markdown.vue";
import { RateType } from "@/client/api/chat";
import { useRate } from "@/client/views/intelligentQA/hooks/useRate";
import "@/styles/katex.css";
import AnswerLike from "@/client/views/intelligentQA/components/AnswerLike.vue";
import AnswerDislike from "@/client/views/intelligentQA/components/AnswerDislike.vue";

const props = defineProps<{
  // 对隐藏元素的描, 如 "h1", "h1,h2"
  readonly hidden?: string;
  content: unknown;
  showOperation?: boolean;
  showRefresh?: boolean;
  hiddenRebuild?: boolean;
  hiddenVote?: boolean;
  index: number;
  isStop?: boolean;
  question?: string;
  reference?: unknown;
  agentType?: AideKey;
  recordId?: number; //问答的id
  commentOn?: RateType; //赞踩的类型
  comment?: string; // 评论
}>();

const md = useMarkdown();

const answerRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const tooltipRef = ref<HTMLDivElement>();
const { voteUp, voteDown, voteDownComment, onVoteUp, onVoteDown } = useRate(props.commentOn, props.comment);
const answer = ref();
const markdownData = ref();

const curReference = ref<Record<string, string>>();
const showTooltip = ref<boolean>(false);

const showTranslation = ref<boolean>(false);
const language = ref<string>("en");
const onClickReference = useClickReference();

const stopTxt = computed(() => {
  if (!props.isStop) return "";
  return `\n <span>已中止回答</span>`;
});

const activeModule = useActiveModule();

watch(
  () => props.content,
  (value) => {
    if (value) {
      const data = value.replace(
        /^(```markdown|```)([\s\S]*?)(```$|$)/g,
        (match: string, p1: string, p2: string) => {
          if (p2) return p2;
          return "";
        },
      );
      answer.value = data;
      markdownData.value = md.render(data);
      if (showTranslation.value) showTranslation.value = false;
    }
  },
  {
    immediate: true,
  },
);
const onMousemove = (e: MouseEvent) => {
  const bottomHeight = 100;
  let left = 0;
  let top = 0;
  const triggerElement = answerRef.value.getBoundingClientRect();
  const tooltipElement = tooltipRef.value.getBoundingClientRect();
  if (e.target && e.target.className === "corner-mark") {
    const element = e.target.getBoundingClientRect();
    const index = e.target.innerHTML - 1;
    curReference.value = props.reference?.[index];
    const width = 260;
    const height = tooltipElement.height;
    if (element.right + width > triggerElement.right) {
      left = triggerElement.right - width - triggerElement.left;
    } else {
      left = element.left - triggerElement.left;
    }
    if (window.innerHeight - element.bottom - bottomHeight < height) {
      top = element.top - triggerElement.top - height;
    } else {
      top = element.bottom - triggerElement.top;
    }
    tooltipRef.value.style.top = `${top}px`;
    tooltipRef.value.style.left = `${left}px`;
    showTooltip.value = true;
  } else {
    showTooltip.value = false;
  }
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

.answer_box {
  position: relative;
  width: 100%;
}

.answer_box_bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: theme.$font-size-base;
}

.answer_box_bottom > :first-child {
  &::before {
    display: none;
  }
}

.model_select {
  display: flex;
}

.detail {
  font-size: theme.$font-size-sm;
  color: theme.$text-color-secondary;
  line-height: 20px;
  font-weight: 400;
}

.tooltip {
  position: absolute;
  width: 260px;
  background-color: theme.$color-white;
  padding: theme.$padding-md;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
  border-radius: theme.$border-radius-lg;
}

.tooltip_content {
  max-height: calc(300px - 32px);
  overflow: hidden;
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

.link {
  &:hover {
    text-decoration: underline;
  }
}

.active {
  color: theme.$color-primary;
}
</style>

<style lang="scss" scoped>
.tooltip-enter-active {
  opacity: 0;
}

.tooltip-leave-active {
  opacity: 1;
}
</style>
