<template>
  <div :class="$style.margin_warp">
    <MemberCountPopover :type="SvcTypeEnum.CONTRACT_AUDIT">
      <template #default="{ disabled }">
        <el-button :disabled="disabled || props.sendDisabled" :class="$style.sendBtn" @click="click">
          <AirplaneIcon />
        </el-button>
      </template>
    </MemberCountPopover>
  </div>

  <BeforeSendDialog v-model="visible" :click-send="props.send" />
</template>

<script setup lang="ts">
import { SvcTypeEnum } from "@/client/api/user";
import { AideKey } from "@/client/const";
import BeforeSendDialog from "@/client/views/audit/components/BeforeSendDialog.vue";
import { ref } from "vue";
import verifySurveyOrAuditCount from "@/client/hooks/verifySurveyOrAuditCount";
import verifyDoc from "@/client/hooks/verifyDoc";
import MemberCountPopover from "@/client/components/MemberCountPopover.vue";
import AirplaneIcon from "@/client/icons/airplane.svg";

const props = defineProps<{
  sendDisabled: boolean;
  send: (outline?: string) => void;
}>();

const visible = ref<boolean>();

const click = () => {
  if (!verifySurveyOrAuditCount("contract", AideKey.CONTRACT_AUDIT)) return;
  const contractSource = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
  if (!contractSource) return;
  visible.value = true;
};

type ExposeType = {
  click: () => void;
};
defineExpose<ExposeType>({
  click,
});
</script>

<style module lang="scss">
@use "src/styles/theme";

.margin_warp {
  margin-left: auto;
}

.sendBtn {
  width: 32px;
  height: 32px;
  background: theme.$color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  --el-button-disabled-bg-color: #306bec;
  --el-button-hover-bg-color: #306bec;

  svg {
    width: 22px;
    fill: theme.$color-white;
  }
}
</style>
