<template>
  <el-breadcrumb v-if="type === 'table' && organization" class="breadcrumb_warp" separator="/">
    <el-breadcrumb-item>{{ organization.name }}</el-breadcrumb-item>
    <el-breadcrumb-item
      ><b style="font-weight: 700">{{ currentNode.name }}</b></el-breadcrumb-item
    >
  </el-breadcrumb>

  <el-tabs v-if="type === 'table'" v-model="active" class="tabs">
    <el-tab-pane v-for="(item, index) in tabsData" :key="index" :name="item.key" class="tab-pane">
      <template #label>
        {{ item.title }}
      </template>
      <component
        :is="item.content"
        :key="projectId"
        v-if="item.key === active"
        v-bind="getComponentProps(item.key)"
      ></component>
    </el-tab-pane>
  </el-tabs>
  <div v-else class="card_wrapper">
    <el-card
      v-for="item in cardData"
      :key="item.id"
      class="card_item"
      :body-style="{ padding: '12px 16px' }"
      :class="{ active: activeCardId === item.id }"
      shadow="hover"
      @click="onClickCard(item)"
    >
      <div class="tag">{{ KNOWLEDGE_BASE_PEOPLE.get(KnowledgeBasePeople.PERSON) }}</div>
      <div class="card_title">
        {{ item.name }}
        <span>{{ item.repositoryType === 1 ? "文档" : "图谱" }}</span>
      </div>
      <div class="card_detail">{{ item.description }}</div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { BaseInfoProp, KnowledgeBasePeople, KnowledgeBaseTabsKey, tabsDataProp } from "@/admin/types";
import { computed, markRaw, ref, watch } from "vue";
import store from "@/store";
import BuildTask from "./BuildTask.vue";
import { KNOWLEDGE_BASE_PEOPLE } from "./const";
import DocumentList from "./DocumentList.vue";
import RelationalGraph from "./relationGraph/index.vue";
import Author from "@/admin/view/knowledgeBase/components/Author.vue";
import { organUnderKnow } from "@/admin/api/knowledge";

const cardData = ref<BaseInfoProp[]>([]);
const activeCardId = ref();

const emit = defineEmits(["change-type"]);
const tabsData = ref<tabsDataProp[]>([]);
const active = ref(KnowledgeBaseTabsKey.RELATIONAL_GRAPH);
const currentNode = computed(() => store.state.knowledge.currentData);
const organization = computed(() => store.state.knowledge.organization);
const projectId = computed(() => {
  const key = currentNode.value.repositoryType === 1 ? "id" : "graphId";
  return currentNode.value[key];
});

const onClickCard = (card: BaseInfoProp) => {
  activeCardId.value = card.id;
  store.commit("knowledge/SET_CURRENT_DATA", card);
  emit("change-type", "table");
};
const props = defineProps<{
  type: "table" | "list";
}>();
const graphTabs: tabsDataProp[] = [
  {
    key: KnowledgeBaseTabsKey.RELATIONAL_GRAPH,
    title: "实体关系图",
    content: markRaw(RelationalGraph),
  },
  {
    key: KnowledgeBaseTabsKey.BUILD_TASK,
    title: "构建任务",
    content: markRaw(BuildTask),
  },
];

const textTabs: tabsDataProp[] = [
  {
    key: KnowledgeBaseTabsKey.DOCUMENT,
    title: "文档列表",
    content: markRaw(DocumentList),
  },
  // {
  //   key: KnowledgeBaseTabsKey.DATA_SOURCE,
  //   title: "数据源",
  //   content: markRaw(DataSource),
  // },
];

const baseTabs: tabsDataProp[] = [
  {
    key: KnowledgeBaseTabsKey.PERMISSION,
    title: "知识库权限",
    content: markRaw(Author),
  },
  // {
  //   key: KnowledgeBaseTabsKey.QUESTION_TEMPLATE,
  //   title: "提问模版",
  //   content: markRaw(QuestionTemplate),
  // },
];

const getOrganUnderKnowList = async (organId: number) => {
  const res = await organUnderKnow(organId);
  cardData.value = res.data;
};

const getComponentProps = (key: KnowledgeBaseTabsKey) => {
  const baseProps = {
    currentProjectId: projectId.value,
  };
  if (key === KnowledgeBaseTabsKey.PERMISSION) {
    return {
      ...baseProps,
      isChangeRequest: true,
    };
  }
  return baseProps;
};

watch(
  currentNode,
  (val) => {
    if (val) {
      if (val.repositoryType === 1) {
        tabsData.value = textTabs.concat(baseTabs);
        active.value = KnowledgeBaseTabsKey.DOCUMENT;
      } else if (val.repositoryType === 2) {
        tabsData.value = graphTabs.concat(baseTabs);
        active.value = KnowledgeBaseTabsKey.RELATIONAL_GRAPH;
      }
    }
  },
  {
    immediate: true,
  },
);

watch(organization, (val) => {
  if (val) {
    getOrganUnderKnowList(val.id);
  }
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";
@import "src/styles/mixins";

.tabs {
  flex: 1;
  height: 100%;
  width: 100%;
}

.tab-pane {
  height: 100%;
}

.breadcrumb_warp {
  height: 15px;
  margin-top: 12px;
}

.card_wrapper {
  height: 100%;
  padding-top: 24px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 90px;
  grid-auto-flow: row;
  grid-gap: 16px;
  cursor: pointer;

  .card_item {
    position: relative;

    .tag {
      position: absolute;
      top: 0;
      right: 0;
      height: 24px;
      line-height: 24px;
      width: 40px;
      background: #086df4;
      border-radius: 0 0 0 12px;
      font-size: $font-size-sm;
      color: #ffffff;
      text-align: center;
      font-weight: 400;
    }

    &:hover {
      border: 2px solid rgba(23, 118, 255, 1);
      box-shadow: 0 4px 8px 0 rgba(174, 209, 255, 0.5);
      border-radius: 4px;
    }

    .card_title {
      height: 22px;
      font-size: $font-size-base;
      color: $text-color-primary;
      line-height: 22px;
      font-weight: 700;
      span {
        padding: 2px 8px;
        background: #f0f3fa;
        border-radius: 2px;
        font-size: 12px;
        color: #2d364d;
        line-height: 20px;
        font-weight: 400;
      }
    }

    .card_detail {
      height: 40px;
      font-size: $font-size-sm;
      color: $text-color-secondary;
      line-height: 20px;
      font-weight: 400;
      @include hide-lines(2);
    }
  }

  .card_item.active {
    border: 2px solid rgba(23, 118, 255, 1);
    box-shadow: 0 4px 8px 0 rgba(174, 209, 255, 0.5);
    border-radius: $border-radius-md;
  }
}
/* :deep(.el-tabs__nav-wrap::after) {
  background-color: inherit;
} */

:deep(.el-tabs__item) {
  font-size: 14px;
  color: #6d7587;
  font-weight: 400;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 700;
  color: #2d364d;
}

:deep(.el-tabs__nav-wrap) {
  height: 48px !important;
}
:deep(.el-tabs__item) {
  height: 48px !important;
}
:deep(.el-tabs__content) {
  height: calc(100% - 63px) !important;
  background: #ffffff;
  padding: $padding-md;
}
</style>

<style scoped>
:deep(.input .el-input__inner) {
  border-radius: 0;
}
</style>
