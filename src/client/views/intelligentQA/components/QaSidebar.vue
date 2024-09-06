<template>
  <ResourceCardList :data="props.data" />
  <Atlas
    :key="props.data.question"
    class="atlas"
    :question="props.data.question"
    :company="props.data.answer?.company"
    :industry_chain="props.data.answer?.industry_chain"
  />
  <Stock v-if="props.data.answer?.related_stocks" :data="props.data.answer?.related_stocks" class="stock" />
</template>
<script setup lang="ts">
import Atlas from "@/client/views/intelligentQA/components/Atlas.vue";
import Stock from "@/client/views/intelligentQA/components/Stock.vue";
import ResourceCardList from "@/client/views/intelligentQA/components/ResourceCardList.vue";
import { QaRecordState, RecordState } from "@/client/types/chat";

const props = defineProps<{
  data: RecordState<QaRecordState>;
}>();
</script>

<style scoped lang="scss">
@import "src/styles/theme";

.atlas {
  height: 200px;
  margin-top: $margin-sm;
}

.stock {
  padding-top: $padding-sm;
}
</style>
