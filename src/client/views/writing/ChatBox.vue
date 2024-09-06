<template>
  <div class="chat-box">
    <div class="chat-items">
      <div
        v-for="(item, index) in records"
        :key="index"
        class="chat-box-item"
        :class="{ 'last-chat': records?.length - 1 === index }"
      >
        <div class="chat-question-left">
          <h2 v-show="item?.question" class="chat-question">{{ item?.question }}</h2>
          <ResponseProgress hidden="p" title="写作需求解读" class="progress" :chatdata="item" />
          <div>
            <el-alert
              v-if="isRecordRejected(item)"
              :title="'Interface /infinity/chat/writing: ' + item.answer.error"
              type="error"
              class="tips-error"
              @close="() => router.go(-1)"
            />
            <ChatSkeleton v-else-if="!item.answer.text && !item.answer.answerStop" title="生成中" />
            <div v-else>
              <References
                v-show="!!item.answer.reference"
                class="references"
                :reference="item.answer.reference"
                :chat-position="index"
              />
              <div class="answer-box">
                <AnswerBox
                  :key="item?.recordId"
                  :reference="item.answer.reference"
                  :show-operation="item.answer.answerStatus === 1"
                  :show-refresh="false"
                  :index="index"
                  :is-stop="item.answer.answerStop"
                  class="answer-box-inner"
                  data-hidden="h5,h6"
                  :content="item.answer.text"
                  :record-id="item?.recordId"
                  :comment-on="item?.commentOn"
                  :comment="item?.comment"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-show="props.outlineVisible" class="chat-question-right">
          <div class="chat-aside">
            <div v-if="isRecordResolved(item)" class="bar-edit">
              <StrokeButton :icon="editAction.icon" @click="() => editArticle(item)">{{
                editAction.name
              }}</StrokeButton>
              <ExportDropMenu @click="(type) => downloadByType(type, item)" />
            </div>
            <template v-if="index === records.length - 1">
              <OutlineEditor
                v-if="initOutline[index]"
                class="outline"
                is-rebuild
                :value="initOutline[index]"
                @generate="(outline: string) => updateOutline(outline, index)"
              />
            </template>
            <template v-else>
              <OutlineNavigator class="outline" :list="getCatalog(item)" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input" :style="{ width: pdfData.chatInputWidth }">
      <ChatInput class="chat-input-inner" />
      <div class="chat-bottom">内容由AI生成，仅供参考</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnswerBox from "@/client/views/intelligentQA/components/AnswerBox.vue";
import ResponseProgress from "@/client/views/intelligentQA/components/ResponseProgress.vue";
import ChatSkeleton from "@/client/components/ChatSkeleton.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import ChatInput from "./InputBox.vue";
import useWriting from "@/client/views/writing/useWriting";
import References from "@/client/views/intelligentQA/components/References.vue";
import OutlineEditor from "@/client/components/OutlineEditor/index.vue";
import ExportDropMenu from "./ExportDropMenu.vue";
import StrokeButton from "./StrokeButton.vue";
import { WritingRecord } from "@/store/modules/chat";
import prepareWrite from "@/store/hooks/prepareWrite";
import OutlineNavigator from "./OutlineNavigator.vue";
import { editAction } from "./transformActions";
import { ExportTypeCode } from "@/client/views/writing/exportableTypes";
import { exportToDocx, exportToPDF } from "@/client/api/chat";
import downloadBlobByLink from "@/client/views/writing/downloadBlobByLink";

const props = defineProps<{
  // 侧边栏中的大纲是否可见
  outlineVisible: boolean;
}>();

const { writingStop, records, send } = useWriting();
const router = useRouter();

const pdfData = computed(() => {
  const showDrawer = store.state.chat.showDrawer;
  const chatInputWidth = showDrawer ? "100%" : "calc(100% - 300px)";
  return { showDrawer, chatInputWidth };
});

const getChatOutline = () => {
  const regex = /^(#+.*?)(?:\n|$)/gm;
  const outline: Record<string, string> = {};
  records.value.forEach((chat, i) => {
    let line = "";
    if ("text" in chat.answer && chat.answer.outline) {
      const matches = chat.answer.outline.matchAll(regex);
      for (const match of matches) {
        line += match[0];
      }
      outline[i] = line;
    }
  });
  return outline;
};

const parseCatalog = (markdown: string) => {
  const arr = markdown.split("\n");
  const reg = /^(#{1,6})\s+(.+)$/;
  type Head = { level: number; name: string; id: number };
  return arr.reduce((list: Head[], it, index) => {
    const res = reg.exec(it);
    if (!res) return list;
    const [, numberSign, name] = res;
    const level = numberSign.length;
    list.push({ level, name, id: index });
    return list;
  }, []);
};

const getCatalog = (record?: WritingRecord) => {
  const outlineMarkdown = record?.answer.outline;
  if (!outlineMarkdown) return null;
  return parseCatalog(outlineMarkdown);
};

// 初始化的大纲
const initOutline = computed(getChatOutline);

// 更新写作大纲
const updateOutline = async (outline: string, index: number) => {
  writingStop(index);

  const writeRecords = [...records.value];
  const currRecord = writeRecords[index];
  const query = currRecord.question;
  const topic_id = currRecord.topicId;
  const record_id = currRecord.recordId;
  const fixedWriteData = {
    ...currRecord,
    answer: {
      ...currRecord.answer,
      answerStop: false,
      isProgress: false,
      answerStatus: undefined,
      progress: [],
      outline,
      text: "",
    },
  };
  writeRecords.splice(index, 1, fixedWriteData);
  prepareWrite(query);
  store.commit("chat/SET_WRITE_DATA", writeRecords);
  const params = {
    query,
    outline,
    regenerate: true,
    topic_id,
    record_id,
  };
  await send(params, !topic_id);
};

const isRecordResolved = (record: WritingRecord) => record.answer.answerStatus === 1;

const isRecordRejected = (record: WritingRecord) => record.answer.answerStatus === 0 && record.answer.error;

const editArticle = async (record: WritingRecord) => {
  await router.push(`/writing/topic/${record.topicId}/record/${record.recordId}/draft/_`);
};

const downloadPDF = async (text: string, name: string) => {
  const blob = await exportToPDF(text);
  downloadBlobByLink(`${name}.pdf`, blob);
};

const downloadDocx = async (text: string, name: string) => {
  const blob = await exportToDocx(text);
  downloadBlobByLink(`${name}.docx`, blob);
};

const downloadByType = async (type: ExportTypeCode, record: WritingRecord) => {
  const catalog = getCatalog(record);
  const markdown = record.answer.text;
  if (!markdown) {
    throw Error("current record no markdown available");
  }
  const name = catalog?.[0].name ?? record.topicId?.toString(16) ?? record.question;
  if (type === "pdf") {
    await downloadPDF(markdown, name);
  } else {
    await downloadDocx(markdown, name);
  }
};
</script>

<style lang="scss" scoped>
@use "src/styles/theme";

.chat-box {
  width: 100%;
  max-width: 100%;
  height: 100%;
  position: relative;
}

.chat-items {
  min-height: calc(100% - 40px);

  .chat-box-item {
    display: flex;
    margin-bottom: 30px;
  }

  .last-chat {
    min-height: 50vh;
  }
}

.divide {
  width: 100%;
  height: 1px;
  margin: 48px auto 0;
  background-color: #e0e4f1;
}

.chat-question-left {
  flex: 1;
  width: 100%;
  padding: 4px theme.$padding-md;

  .progress {
    margin-top: theme.$margin-md;
    width: 100%;

    &:deep(.title-wrapper) {
      font-size: 16px;
    }
  }

  .references {
    margin-top: 20px;
  }
}

.chat-question-right {
  width: 300px;
  padding: var(--padding);
  position: relative;

  .sticky-wrapper {
    padding-top: 5px;
    position: sticky;
    top: 20px;

    .atlas {
      height: 200px;
      margin-top: theme.$margin-sm;
    }

    .stock {
      padding-top: theme.$padding-sm;
    }
  }

  .close-btn {
    position: absolute;
    top: 0;
    left: -26px;
    padding: 15px 5px;
    background-color: #fff;
    border-radius: 8px 0 0 8px;

    .close-btn-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.chat-question {
  color: theme.$text-color-primary;
  font-size: 28px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 14px 0 0;
  font-weight: bold;
  text-align: justify;
}

.answer-box {
  margin-top: 20px;
}

.chat-input {
  position: sticky;
  padding: 0 theme.$padding-sm;
  z-index: 10;
  bottom: 0;

  .chat-bottom {
    padding-top: 27px;
    height: 48px;
    text-align: center;
    font-size: theme.$font-size-sm;
    color: theme.$text-color-secondary;
    background: linear-gradient(to top, #fff 0%, #fff 33%, transparent 100%);
  }
}

.related-problem {
  margin-top: 20px;
  border-top: 1px solid #e0e1e5;
  padding-top: 20px;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #e0e4f1;
}

.outline {
  margin-top: 30px;
  margin-left: 8px;
}

.tips-error {
  margin: 15px 0;
}

.bar-edit {
  display: flex;
  margin-top: 24px;
  gap: 8px;
}

.chat-aside {
  position: sticky;
  top: 20px;
}
</style>
