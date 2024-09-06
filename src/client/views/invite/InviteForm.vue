<template>
  <InviteLink></InviteLink>
  <InviteContent v-model="dtoInvites" />
  <InviteSize v-model:inviteNumber="inviteNumber" v-model:inviteRank="inviteRank"></InviteSize>
</template>
<script setup lang="ts">
import InviteContent from "./InviteContent.vue";
import InviteLink from "./InviteLink.vue";
import InviteSize from "@/client/views/invite/InviteSize.vue";
import { onMounted, ref } from "vue";
import { getInviteTable, DtoInvite } from "@/client/api/invite";

const inviteNumber = ref(0);
const inviteRank = ref(0);
const dtoInvites = ref<DtoInvite[]>([]);
onMounted(async () => {
  const result = await getInviteTable();
  dtoInvites.value = result.dtoInvites;
  inviteNumber.value = result.dtoInvite?.count ?? 0;
  inviteRank.value = result.dtoInvite?.ranking ?? 0;
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: #{theme.$dialog-breath-vertical} 0 0;
  width: 500px;
}

.title {
  color: theme.$text-color-primary;
  padding-left: theme.$dialog-breath-horizontal;
  font-weight: bold;
  font-size: theme.$font-size-xxl;
  line-height: 32px;
  text-align: left;
  font-style: normal;
}
</style>
