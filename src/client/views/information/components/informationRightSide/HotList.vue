<template>
  <div class="hot-list">
    <div class="hot-list-title">
      <div class="hot-list-title-left">
        <span class="hot-list-title-left-text"><Lightning />24小时热度榜单</span>
        <div class="hot-list-title-left-tab">
          <span class="hot-list-title-left-tab-item"></span>
        </div>
      </div>
      <!-- <Sort v-if="sortType === 'hot'" @click="handleClick('desc')" />
      <SortDown v-else-if="sortType === 'desc'" @click="handleClick('asc')" />
      <SortUp v-else @click="handleClick('hot')" /> -->
    </div>

    <ul class="hot-list-content">
      <li v-if="isLoading">
        <el-skeleton animated style="margin-left: 20px; width: calc(100% - 20px)" />
      </li>
      <el-scrollbar v-else-if="hotList.length">
        <li
          v-for="(item, index) in hotList"
          :key="item.news_id"
          class="hot-list-content-item"
          @click="getNewsDetail(item)"
        >
          <div class="hot-list-content-item-hot">
            <span class="index">{{ index + 1 }}</span>
            <span class="hot">{{ item.hot_past24 }}</span>
          </div>
          <div class="hot-list-content-item-content">
            <span class="item-content-title" :title="item.title">{{ item.title }}</span>
            <span class="item-content-time"><Clock class="cat-icon" />{{ item.publish_time }}</span>
          </div>
        </li>
      </el-scrollbar>
      <el-empty v-else description="暂无数据" :image-size="100" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getHotNewsList } from "@/client/api/news";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import Lightning from "@/client/icons/lightning.svg";
import { NewsProps } from "@/client/types/news";
import useClearChat from "@/store/hooks/useClearChat";
import { Clock } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import reAuth from "@/sign/reAuth";

const sortType = ref<"desc" | "asc" | "hot">("hot");
const hotList = ref<any>([]);
const isLoading = ref(false);

const store = useStore();
const { clearChat } = useClearChat();
const { send } = useSendQuestion();

const getHotList = async () => {
  isLoading.value = true;
  const json = {
    start: 0,
    size: 1000, // todo
    threadshold: 120, // todo
    orderBy: sortType.value === "hot" ? "desc" : sortType.value,
    orderField: sortType.value === "hot" ? "hot_past24" : "publish_time",
  };
  let res = null;
  try {
    res = await getHotNewsList(json);
  } catch (e) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
  if (!res) return;
  hotList.value = res.slice(0, 8);
  isLoading.value = false;
};

let timer: any = null;
onMounted(() => {
  getHotList();

  timer = setInterval(
    () => {
      getHotList();
    },
    1000 * 60 * 15,
  );
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const router = useRouter();

const getNewsDetail = (record: NewsProps) => {
  if (isAnonymous.value) {
    // 不需要调用退出接口
    return reAuth().catch(console.error);
  }
  clearChat();
  store.commit("chat/SET_QUESTION", record.title);
  store.commit("chat/SET_CHAT_DATA", [
    {
      question: record.title,
      answer: {
        isProgress: false,
        answerStop: false,
        progress: [],
      },
    },
  ]);
  send({ query: record.title, newsId: record.news_id });
  store.commit("documentQA/SET_NEWS_ID", record.news_id);
  router.push(`/new/${record.news_id}`);
};

const handleClick = (type: "desc" | "asc" | "hot") => {
  sortType.value = type;
  getHotList();
};
</script>

<style lang="scss" scoped>
.hot-list {
  width: 100%;
  height: 528px;
  margin-bottom: 16px;

  &-title {
    width: 100%;
    line-height: 56px;
    padding-left: 40px;
    display: flex;
    align-items: center;
    height: 54px;
    padding-top: 32px;
    margin-bottom: 16px;

    &-left {
      display: flex;
      width: calc(100% - 32px);
      margin-right: 12px;
      justify-content: space-between;

      &-text {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #2d364d;
        margin-left: 3px;
        height: 26px;
        font-weight: bold;

        svg {
          margin-right: 3px;
          margin-bottom: 3px;
        }
      }

      &-tab {
        display: flex;
        align-items: center;

        &-item {
          color: #2d364d;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
        }
      }
    }

    svg {
      cursor: pointer;
    }
  }

  &-content {
    width: 100%;
    height: calc(100% - 64px);
    padding-left: 40px;
    // padding-left: 24px;

    &-item {
      display: flex;
      align-items: center;
      height: 46px;
      cursor: pointer;
      margin-bottom: 12px;

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        .hot {
          background: rgba(247, 13, 45, 0.06);
        }

        .index,
        .hot {
          color: #f70d2d !important;
        }
      }

      &.active,
      &:hover {
        .item-content-title {
          color: #086df4 !important;
        }
      }

      &-hot {
        width: 46px;
        height: 46px;
        text-align: center;
        margin-right: 10px;
        color: #f60d2d;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .index {
          font-family: DingTalk;
          font-weight: normal;
          font-size: 20px;
          color: #f70d2d;
          line-height: 24px;
          margin-bottom: 5px;
          height: 24px;
          color: #2d364d;
        }

        .hot {
          width: 41px;
          height: 16px;
          line-height: 16px;
          font-size: 10px;
          background: #f0f0f0;
          border-radius: 2px;
          font-family: DingTalk;
          color: #6d7587;
        }
      }

      &-content {
        width: calc(100% - 56px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;

        .item-content-title {
          width: 100%;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-content-time {
          display: flex;
          align-items: center;
          height: 19px;
          color: #6d7587;
          font-size: 12px;

          svg {
            width: 13px;
            height: 13px;
            margin-right: 2px;
          }
        }
      }
    }

    :deep(.el-scrollbar) {
      .el-skeleton {
        width: calc(100% - 20px);
      }
    }
  }
}
</style>
