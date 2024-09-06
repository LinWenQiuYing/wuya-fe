<template>
  <div v-show="show" :class="$style.atlas_wrapper">
    <iframe
      ref="atlasRef"
      style="width: 100%; height: 100%; border-radius: 8px; border: none"
      :src="iframeUrl"
      name="kge"
      @load="handleIframeLoad(cmd)"
    ></iframe>
    <span :class="$style.icon_wrapper" title="点击预览图谱" @click="onClick">
      <MaximizeIcon />
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import store from "@/store";
import useDrawer from "@/client/hooks/useDrawer";
import { getAtlas } from "@/client/api/chat";
import MaximizeIcon from "@/client/icons/maximize.svg";
import { baseURL } from "@/config";

const props = defineProps<{
  industry_chain?: {
    cypher: string;
    graph_name: string;
  };
  question: string;
  company?: string[];
}>();
const atlasRef = ref();
const { open } = useDrawer();
const cmd = ref<string>("");
const graphName = ref("");
const iframeUrl = ref("");
const show = computed(() => !!cmd.value && iframeUrl.value && !!graphName.value);

const onClick = () => {
  store.commit("chat/SET_CMD", cmd.value);
  store.commit("chat/SET_GRAPH_NAME", graphName.value);
  open("atlas");
};

const handleIframeLoad = (cmd: string) => {
  if (atlasRef.value) {
    atlasRef.value.contentWindow.postMessage(
      JSON.stringify({
        type: "query",
        cmd: `${cmd}`,
      }),
    );
  }
};

watch(
  [() => props.industry_chain, () => props.company, () => props.question, () => store.state.chat.chat_id],
  ([industry_chain, condition_company, user_query, topic_id]) => {
    if (industry_chain) {
      const cypher = industry_chain?.cypher;
      graphName.value = industry_chain.graph_name;
      iframeUrl.value = `${baseURL}/manager/home#/newQuery?graph.name=${industry_chain.graph_name}&&enable.embedded=true&&only.show.graph=true&&hide.tools=true`;
      cmd.value = cypher;
      handleIframeLoad(cypher);
    } else if (condition_company?.length > 0 && condition_company[0] !== "" && user_query && topic_id) {
      getAtlas({
        condition_company,
        user_query,
        topic_id,
      }).then((res) => {
        const cypher = res?.cypher;
        graphName.value = res.graph_name;
        iframeUrl.value = `${baseURL}/manager/home#/newQuery?graph.name=${res.graph_name}&&enable.embedded=true&&only.show.graph=true&&hide.tools=true`;
        if (cypher && cypher.length > 0) {
          const curCmd = cypher[0].split("[industry_chain_sep]")[1];
          cmd.value = curCmd;
          handleIframeLoad(curCmd);
        }
      });
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" module>
@use "src/styles/theme";

.atlas_wrapper {
  position: relative;
  width: 100%;
  border-radius: theme.$border-radius-lg;
  border: 2px solid rgb(224, 228, 241);
}

.icon_wrapper {
  right: 8px;
  bottom: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }

  svg {
    fill: theme.$color-white;
    height: 20px;
  }
}
</style>
