<template>
  <preview-drawer v-if="isMobile">
    <div :class="$style.h5">
      <H5Intro />
      <ChatInputBox :input-placeholder="props.placeholder" :questions="questions" @send="sendChat" />
      <RecommendVisibleFilter>
        <div :class="$style.list">
          <H5Question
            v-for="(question, index) in questions"
            :key="index"
            :text="question.title"
            :type="question.type!"
            @click="() => sendQuestion(question)"
          />
        </div>
      </RecommendVisibleFilter>
    </div>
  </preview-drawer>
  <div v-else :class="$style.pc">
    <preview-drawer>
      <div :class="$style.main">
        <Intro
          :title="AgentParams?.name"
          :description="AgentParams?.description"
          :agent-type="AgentParams?.key"
          :in-agent="!!AgentParams"
        />
        <ChatInputBox :input-placeholder="placeholder" is-agent :questions="questions" @send="sendChat" />
        <RecommendVisibleFilter>
          <slot name="recommend">
            <AgentQuestion>
              <div :class="$style.list">
                <AnonymousKey #default="{ key }">
                  <HotQuestion
                    v-for="(question, index) in questions"
                    :key="index"
                    :data="question"
                    @click="() => sendQuestion(question, key)"
                  />
                </AnonymousKey>
              </div>
            </AgentQuestion>
          </slot>
        </RecommendVisibleFilter>
      </div>
    </preview-drawer>
    <div v-if="!props.hiddenIcp && !inTag" :class="$style.footer">
      <ICP />
    </div>
  </div>
</template>

<script setup lang="ts">
import Intro from "@/client/components/Intro.vue";
import H5Intro from "@/client/components/H5Intro.vue";
import HotQuestion from "./intelligentQA/HotQuetions.vue";
import ChatInputBox from "@/client/components/ChatInputBox.vue";
import createChat from "@/client/hooks/createChatTopic";
import useRecommendedQuestions, { HotQuestionsState } from "@/client/hooks/useRecommendedQuestions";
import createNewsChatTopic from "@/client/hooks/createNewsTopic";
import { isMobile } from "@/config";
import H5Question from "./intelligentQA/H5Question.vue";
import RecommendVisibleFilter from "@/client/components/RecommendVisibleFilter.vue";
import ICP from "@/client/components/ICP.vue";
import useInputPlaceholder from "@/client/hooks/useInputPlaceholder";
import { AgentItem } from "@/client/const";
import PreviewDrawer from "@/client/components/PreviewDrawer.vue";
import AgentQuestion from "@/client/components/AgentQuestion.vue";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import { useRoute } from "vue-router";
import AnonymousKey from "@/client/components/AnonymousKey.vue";

const props = defineProps<{
  createChatTopic?: (problem: string, options?: { rule?: string }) => void;
  hiddenIcp?: boolean;
  placeholder?: string;
  AgentParams?: AgentItem;
}>();

const questions = useRecommendedQuestions();
const route = useRoute();
const inTag = omitRestQueryValue(route.query.tag) === "off";
const placeholder = props.placeholder ?? useInputPlaceholder();
const sendChat = props.createChatTopic ?? createChat;
const sendQuestion = async (query: HotQuestionsState, key?: string) => {
  if (query.type === "report") {
    await createChat(query.title, { key });
  } else {
    await createNewsChatTopic(query, key);
  }
};
</script>

<style lang="scss" module>
@import "src/styles/theme";

.pc {
  height: 100%;
  display: flex;
  background-color: #fff;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 1;
}

@media (min-width: 1400px) {
  .main {
    max-width: 880px;
    margin: auto 75px;
  }
}

@media (max-width: 1400px) {
  .main {
    max-width: 70%;
    min-width: 300px;
    margin: auto;
  }
}

.h5 {
  min-height: 100%;
  min-width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  justify-content: flex-start;
  background: linear-gradient(163deg, #f8f7fe 0%, #fffbfd 12%, #fff 32%, #fff 100%);
}

.h5 .list {
  padding: $padding-md;
  display: flex;
  flex-wrap: wrap;
  justify-items: flex-start;
  align-content: center;
}

.pc .list {
  min-height: 200px;
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, min-content);
  grid-auto-rows: minmax(100px, auto);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 0 16px;
  background: #fff;
}
</style>
