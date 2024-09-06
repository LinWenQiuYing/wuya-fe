<template>
  <el-dialog v-model="dialogVisible" :class="$style._">
    <template #header>
      <MemberHeader v-if="isMembership" :member-info="memberInfo!" :class="$style.header" />
      <h3 v-else :class="$style.title">月度会员</h3>
    </template>
    <PrivilegeIntro :class="$style.intro" />
    <PurchaseBar :action="payAction" :class="$style.bar" @pay="onPaid" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { useCssModule } from "vue";
import MemberHeader from "./MemberHeader.vue";
import PrivilegeIntro from "./PrivilegeIntro.vue";
import PurchaseBar from "./PurchaseBar.vue";
import { computed } from "vue";
import { ElMessage } from "element-plus";
import getDatePart from "./getDatePart";
import useMemberInfo, { reloadMemberInfo, memberInfo, isMembership } from "@/store/useMemberInfo";

const dialogVisible = defineModel<boolean>("visible", { required: true });

const $style = useCssModule();
useMemberInfo();

const payAction = computed(() => (isMembership.value ? "续费" : "支付"));

const tipPaid = (action: string, expired: string) => {
  ElMessage.success({
    message: `月度会员${action}成功！会员有效期至${getDatePart(expired)}`,
    showClose: true,
    customClass: $style.tips,
  });
};

const onPaid = async () => {
  const exactAction = payAction.value;
  const info = await reloadMemberInfo().catch(console.error);
  if (!info) return;
  tipPaid(exactAction, info.annualMemEnd);
  dialogVisible.value = false;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  position: relative;
  width: 640px;
  min-height: 400px;
  box-shadow: 0 4px 12px 0 rgba(45, 54, 77, 0.1);
  border-radius: 8px;
  --el-dialog-padding-primary: 0 0 30px;

  &::before {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: block;
    content: " ";
    height: 184px;
    background: linear-gradient(174deg, rgba(160, 217, 252, 0.68) 0%, rgba(255, 255, 255, 0) 40%),
      linear-gradient(188deg, #a0b1fc 0%, rgba(255, 224, 247, 0.7) 21.6%, rgba(255, 255, 255, 0) 40%);
    border-radius: 6px;
    opacity: 0.6;
    z-index: 0;
    pointer-events: none;
  }
}

.header {
  padding: 47px 36px;
}

.title {
  font-weight: bold;
  font-size: 22px;
  color: theme.$text-color-primary;
  line-height: 32px;
  padding: 44px 42px 20px;
}

.intro {
  margin: 0 40px;
}

.bar {
  margin: 40px 36px 0;
}

.tips {
  width: 580px;
  height: 40px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  --el-message-bg-color: #f6ffed;
  --el-message-border-color: #d9f7be;
  --el-message-text-color: rgba(0, 0, 0, 0.88);

  :global {
    .el-message__icon {
      color: #52c41a;
    }

    .el-message__content {
      margin-right: auto;
    }
  }
}
</style>
