<template>
  <div v-show="visible" ref="listWarpRef" :class="$style._">
    <p :class="$style.title">推荐助手</p>
    <div
      v-for="(item, index) in props.list"
      :key="item.key"
      :ref="(el) => (itemRefs[index] = el as Element)"
      :class="[$style.item, index === selectedIndex && $style.selected]"
      @click="() => handleAgent(item.key)"
    >
      <ViewImg
        v-if="agentImgSrc.has(item.key)"
        :src="agentImgSrc.get(item.key)!.circle"
        :class="$style.icon"
      />
      <span :class="$style.agent_name">{{ item.name }}</span>
      <span :class="$style.describe">{{ item.description }}</span>
    </div>

    <p v-if="questionList.length" :class="[$style.title, $style.margin]">推荐问题</p>
    <ul v-if="questionList.length">
      <li
        v-for="(item, index) in questionList"
        :key="index"
        :class="$style.item"
        @click="() => createChatTopic(item.title)"
      >
        <SearchIcon :class="$style.quest_icon" />
        <span :class="$style.quest_title">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { HotQuestionsState } from "@/client/hooks/useRecommendedQuestions";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import store from "@/store";
import createChatTopic from "@/client/hooks/createChatTopic";
import { AgentItem, AideKey, aideList } from "@/client/const";
import SearchIcon from "@/client/icons/search.svg";
import ViewImg from "@/components/ViewImg.vue";
import { agentImgSrc } from "@/components/utils";
import useTree from "@/client/hooks/useTree";

const props = defineProps<{
  questions?: HotQuestionsState[];
  list: AgentItem[];
}>();
const query = defineModel<string>("query");
const visible = defineModel<boolean>("visible");
const listWarpRef = ref<Element>();
const itemRefs = reactive<Element[]>([]);
const selectedIndex = ref<number>(0);
const { setAssignSource } = useTree();

const defaultQuestionMap = new Map<AideKey, string>([
  [AideKey.VIDEO_PARSE, "请总结这个视频"],
  [AideKey.CONTRACT_AUDIT, "请审核这份合同，确认是否符合所有规则"],
  [AideKey.FINANCIAL_ANALYSIS, "请审核这份财务报表"],
]);

const questionList = computed(() => {
  const next = props.questions?.filter((item) => item.type === "report");
  if (!next) return [];
  return next.slice(0, 3);
});

// @ 不同的助手时 设置对应的default source
const checkAgentSource = (key: AideKey) => {
  const aide = aideList.find((item) => item.key === key);
  if (!aide) return;
  setAssignSource(aide.defaultSource);
};

const handleAgent = (key: AideKey) => {
  store.commit("agent/SET_TYPE", key);
  checkAgentSource(key);
  const idx = query.value!.lastIndexOf("@");
  if (idx < 0) return;
  if (!query.value!.slice(0, idx).trim()) {
    query.value = defaultQuestionMap.get(key) ?? "";
  } else {
    query.value = query.value!.slice(0, idx);
  }
  visible.value = false;
};

// 判断当前元素是否在视口内
const isElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const containerRect = el.parentElement!.getBoundingClientRect();
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
};

const scrollBoxTop = (index: number) => {
  if (!isElementInViewport(itemRefs[index])) itemRefs[index].scrollIntoView();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!visible.value) return;
  const index = selectedIndex.value;
  switch (event.key) {
    case "ArrowUp":
      selectedIndex.value = index > 0 ? index - 1 : props.list.length - 1;
      break;
    case "ArrowDown":
      selectedIndex.value = index < props.list.length - 1 ? index + 1 : 0;
      break;
    case "Enter":
      event.stopPropagation();
      if (props.list[index]) {
        handleAgent(props.list[index].key);
      }
      break;
  }
  scrollBoxTop(selectedIndex.value);
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

watch(
  () => props.list,
  () => {
    selectedIndex.value = 0;
  },
);
</script>

<style module lang="scss">
@import "src/styles/theme";

._ {
  width: 100%;
  max-height: 200px;
  padding: $padding-sm;
  overflow: auto;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(45, 54, 77, 0.1);
  border-radius: $border-radius-xxl;

  .title {
    font-size: $font-size-sm;
    color: $text-color-primary;
    height: 18px;
    line-height: 18px;
  }

  .margin {
    margin-top: 8px;
  }

  .item {
    display: flex;
    align-items: center;
    border-radius: $border-radius-md;
    padding: $padding-xss $padding-xs;
    cursor: pointer;

    &:hover {
      background: #f0f2f7;
    }

    .icon {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }

    .agent_name {
      font-size: $font-size-base;
      font-weight: bold;
      color: $text-color-primary;
      margin: 0 $margin-xs 0 10px;
    }

    .describe {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: $font-size-sm;
      color: #6d7587;
    }
  }
  .selected {
    background: #f0f2f7;
  }
  .quest_icon {
    width: 20px;
    margin-right: 5px;
    color: #b3b9c7;
  }

  .quest_title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: $font-size-base;
  }
}
</style>
