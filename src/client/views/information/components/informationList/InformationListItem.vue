<template>
  <div :class="[$style.information_list_item, isMobile ? $style.h5 : '']">
    <li>
      <div :class="$style.img_box" @click="getNewsDetail(data)">
        <el-image :src="data.image_url" lazy fit="cover" />
      </div>
      <div :class="$style.information_content">
        <div :class="$style.title_box" @click="getNewsDetail(data)">
          <span v-if="data.isHot" :class="$style.hot">热门</span>
          <span :class="$style.news_title">{{ data.title }}</span>
        </div>
        <div v-if="isResult && !isMobile" :class="$style.news_content" @click="getNewsDetail(data)">
          <span>...</span>
          <span
            v-html="
              data.highlight
                ? data.highlight.content
                  ? data.highlight.content[0]
                  : data.content
                : data.content
            "
          ></span>
          <span>...</span>
        </div>
        <div v-else-if="!isMobile" :class="$style.news_content" @click="getNewsDetail(data)">
          {{ data.content }}
        </div>
        <div :class="$style.cat_box">
          <div v-if="data.sort_industry && data.sort_industry.length" :class="$style.tags">
            <div
              v-for="(v, index) in data.sort_industry.slice(0, sliceNum)"
              :key="index"
              :class="$style.tags_item"
            >
              {{ v }}
            </div>
            <el-popover
              v-if="data.sort_industry.length > sliceNum"
              :placement="isMobile ? 'bottom' : 'right'"
              width="auto"
              :trigger="isMobile ? 'click' : 'hover'"
              :popper-class="$style.tags_popover"
            >
              <template #default>
                <div :class="$style.tags">
                  <div
                    v-for="(v, index) in data.sort_industry.slice(sliceNum)"
                    :key="index"
                    :class="$style.tags_item"
                  >
                    {{ v }}
                  </div>
                </div>
              </template>
              <template #reference>
                <div :class="[$style.tags_item, $style.more]">
                  {{ data.sort_industry.slice(sliceNum).length }}+
                </div>
              </template>
            </el-popover>
          </div>
          <div v-else :class="$style.tags" />
          <div :class="$style.cat_box_icons">
            <p :class="$style.time">
              <Clock v-if="!isMobile" :class="$style.cat_icon" />
              {{ getTimeDifference(data.publish_time) }}
            </p>
            <p v-if="data.hot_past72" :class="$style.num">
              <View :class="$style.cat_icon" />
              {{ data.hot_past72 }}
            </p>
          </div>
        </div>
      </div>
    </li>
  </div>
</template>

<script setup lang="ts">
import useSendQuestion from "@/client/hooks/useSendQuestion";
import { NewsProps } from "@/client/types/news";
import { isMobile } from "@/config";
import useClearChat from "@/store/hooks/useClearChat";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import { Clock, View } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { AideKey } from "@/client/const";
import reAuth from "@/sign/reAuth";
import { computed } from "vue";

defineProps<{
  data: NewsProps;
  isResult: boolean;
}>();

const router = useRouter();
const store = useStore();
const { clearChat } = useClearChat();
const { send } = useSendQuestion();

const getNewsDetail = (record: NewsProps) => {
  if (isAnonymous.value) {
    reAuth().catch(console.error);
  } else {
    clearChat();
    store.commit("chat/SET_QUESTION", record.title);
    store.commit("chat/SET_CHAT_DATA", [
      {
        question: record.title,
        newsId: [`news-${record.news_id}`],
        answer: {
          isProgress: false,
          answerStop: false,
          progress: [],
        },
      },
    ]);
    store.commit("chat/TOGGLE_STARTCHAT", true);
    store.commit("chat/SET_IS_STOP", false);
    send({ query: record.title, newsId: record.news_id, chat_agent: AideKey.NO_AGENT }).catch(console.error);
    store.commit("documentQA/SET_NEWS_ID", record.news_id);
    router.push(`/new/${record.news_id}`).catch(console.error);
  }
};

const getTimeDifference = (serverTime: string) => {
  const serverDate = dayjs(serverTime).valueOf();
  const currentDate = dayjs().valueOf();
  const timeDifference = Math.floor((currentDate - serverDate) / (1000 * 60 * 60)); // 计算相差小时数

  if (timeDifference < 1) {
    return "刚刚";
  } else if (timeDifference <= 24) {
    return `${timeDifference}小时前`;
  } else if (isMobile) {
    const parsedDate = dayjs(serverTime);
    return parsedDate.format("MM-DD  HH:mm");
  } else {
    const parsedDate = dayjs(serverTime);
    return parsedDate.format("YYYY-MM-DD HH:mm:ss");
  }
};

const sliceNum = computed(() => {
  return isMobile ? 2 : 4;
});
</script>

<style lang="scss" module>
.information_list_item {
  padding-top: 12px;
  margin-bottom: 12px;

  :global {
    em {
      color: red;
    }
  }

  &.h5 {
    padding-top: 0;
    margin-bottom: 18px;
    border-bottom: 1px solid #f2f2f2;

    li {
      margin-bottom: 18px;
    }

    .img_box {
      width: 90px;
      height: 70px;
    }

    .information_content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 14px;

      .title_box {
        height: 44px !important;

        .news_title {
          height: 100% !important;
          line-height: 22px !important;
          display: -webkit-box;
          white-space: normal !important;
          line-clamp: 2;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .cat_box {
        height: 16px;

        // .tags {
        //   &_item {
        //     color: #999;
        //     font-size: 11px;
        //     height: 16px;
        //     line-height: 16px;
        //     padding: 0;
        //     background-color: transparent;
        //   }
        // }

        .time {
          width: 70px;
          color: #999;
          margin-right: 0;
          justify-content: flex-end;
        }
      }
    }
  }

  .item_title {
    display: inline-block;
    padding: 0 12px;
    height: 27px;
    line-height: 27px;
    background: #edeff3;
    border-radius: 6px;
    color: #2d364d;
    margin-bottom: 12px;
  }

  li {
    display: flex;
    margin-bottom: 20px;

    .img_box {
      width: 96px;
      height: 96px;

      &:hover {
        cursor: pointer;
      }

      :global {
        .el-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }

    .information_content {
      flex: 1;
      margin-left: 16px;

      .title_box {
        width: 100%;
        display: flex;
        height: 24px;
        align-items: center;

        &:hover {
          cursor: pointer;
        }

        .hot {
          display: inline-block;
          margin-right: 7px;
          padding: 0 5px;
          line-height: 26px;
          background-color: #e31430;
          color: #fff;
          font-size: 12px;
          border-radius: 4px;
        }

        .news_title {
          flex: 1;
          width: 0;
          height: 26px;
          line-height: 26px;
          font-weight: bold;
          font-size: 16px;
          color: #2d364d;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
      }

      .news_content {
        width: 100%;
        height: 44px;
        margin: 4px auto;
        font-size: 14px;
        color: #6d7587;
        line-height: 22px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        &:hover {
          cursor: pointer;
        }
      }

      .cat_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #5f7292;
        height: 22px;

        &_icons {
          .time {
            display: flex;
            align-items: center;
            margin-right: 10px;

            .cat_icon {
              width: 13px;
              height: 13px;
              margin-right: 5px;
              vertical-align: text-bottom;
            }
          }
        }
      }
    }
  }
}

.tags_popover {
  &:global(.el-popper) {
    padding: 5px;
    max-width: 240px;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;

  &_item {
    height: 20px;
    padding: 0 6px;
    line-height: 20px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(204, 204, 204, 0.15);
    color: #6082b1;

    &.more {
      color: #6d7587;

      &:hover {
        color: #306bec;
      }
    }

    &.risk {
      color: #be8765;
    }
  }
}
</style>
