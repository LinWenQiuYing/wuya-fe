<template>
  <preview-drawer>
    <div :class="$style.main">
      <Intro />
      <ChatInputBox :input-placeholder="placeholder" :is-agent="false" @send="createWriteTopic" />
      <div :class="$style.list">
        <Question
          v-for="({ question }, index) in questions"
          :key="index"
          :data="question"
          @click="() => createWriteTopic(question)"
        />
      </div>
    </div>
  </preview-drawer>
</template>
<script setup lang="ts">
import Intro from "@/client/components/Intro.vue";
import Question from "@/client/components/Question.vue";
import ChatInputBox from "@/client/components/ChatInputBox.vue";
import useQuestions from "@/client/hooks/useQuestions";
import createWriteTopic from "@/client/hooks/createWriteTopic";
import PreviewDrawer from "@/client/components/PreviewDrawer.vue";

const placeholder = "我是写作助手，可以快速生成高质量文本，提升写作效率和内容质量";
const { questions } = useQuestions("writing");
</script>
<style lang="scss" module>
@use "src/styles/theme";

.main {
  margin: auto 75px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
}

@media (min-width: 1400px) {
  .main {
    max-width: 880px;
  }
}

@media (max-width: 1400px) {
  .main {
    max-width: 70%;
    min-width: 300px;
  }
}

.list {
  min-height: 200px;
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, min-content);
  grid-auto-rows: minmax(100px, auto);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}
</style>
