<!-- 图谱构建-标签管理 -->
<template>
  <div class="relation">
    <RelationLeft :currentProjectId="currentProjectId" @immediateUpdate="immediateUpdate"></RelationLeft>
    <RelationRight :currentProjectId="currentProjectId" ref="graphRef"></RelationRight>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import RelationLeft from "./components/RelationLeft.vue";
import RelationRight from "./components/RelationRight.vue";

const props = defineProps<{
  currentProjectId: string;
}>();

const graphRef = ref(null);

//左侧列表新建标签项之后，需更新图谱
const immediateUpdate = () => {
  graphRef.value && graphRef.value.updateGrapgh();
};

onMounted(() => {
  //graphRef.value && graphRef.value.updateGrapgh();
});
</script>

<style lang="scss">
@import "src/styles/theme";
.relation {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
