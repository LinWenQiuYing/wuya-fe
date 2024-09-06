<template>
  <div :class="$style.radio_box">
    <el-radio-group v-model="company" :class="$style.radio_warp">
      <el-radio
        v-for="(item, i) in props.data.answer.preCheckConfirms"
        :key="i"
        :value="i"
        :class="$style.radio_item"
        >{{ item.candidate_enterprise_name }}<span :class="$style.survival">存续</span></el-radio
      >
    </el-radio-group>
    <el-button type="primary" round size="small" :class="$style.check" @click="sendQuery">确定</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import useSurvey from "@/client/views/survey/hooks/useSurvey";
import store from "@/store";
import { RecordState, SurveyRecordState } from "@/client/types/chat";
import { AideKey } from "@/client/const";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import useActiveModule from "@/client/layout/useActiveModule";

const props = defineProps<{
  data: RecordState<SurveyRecordState>;
}>();
const company = ref<number>(0);
const { send } = useSurvey();
const { send: sendQa } = useSendQuestion();
const activeModule = useActiveModule();

const sendQuery = async () => {
  const curData = { ...props.data };
  const chatId = store.state.chat.chat_id;
  if (company.value === undefined) return;
  const query = curData.question;
  const currentCompany = curData.answer.preCheckConfirms![company.value];
  const { recordId, outline } = curData.answer;
  delete curData.answer.preCheckConfirms;
  const params = {
    enterprise_name: currentCompany.candidate_enterprise_name,
    stock_code: currentCompany.candidate_stock_code ?? "",
    outline,
    modify_flag: !!outline,
    qa_record_id: recordId,
    query,
    topic_id: chatId!,
  };
  if (activeModule.value === "survey") {
    store.commit("chat/SET_SURVEY_DATA", [...store.state.chat.surveyData.slice(0, -1), curData]);
    await send(params, true);
  } else {
    store.commit("chat/SET_CHAT_DATA", [...store.state.chat.chatData.slice(0, -1), curData]);
    await sendQa({ ...params, chat_agent: AideKey.ENTERPRISE_RESEARCH });
  }
};

onMounted(() => {
  if (props.data.answer.preCheckConfirms?.length === 1) {
    sendQuery().catch(console.error);
  }
});
</script>

<style module lang="scss">
.radio_box {
  text-align: right;
}

.radio_warp {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
}
.radio_item {
  background: #f1f2f6;
  border-radius: 17px;
  padding: 0 15px;
  margin: 0;

  .survival {
    font-size: 12px;
    padding: 5px;
    margin-left: 5px;
    color: #216f55;
    background: #e8faef;
  }
}
.check {
  margin: 10px 0;
  --el-color-primary: #086df4;
}
</style>
