<template>
  <button type="button" :class="$style.btn" @click="alipay">alipay</button>
  <button type="button" :class="$style.btn" @click="wxpay">wxpay</button>
  <div v-if="alipayForm" ref="alipayFormRef" v-html="alipayForm" />
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { getMonthlyCard, getTradeForm } from "@/client/api/user";
import { ElMessage } from "element-plus";

const productId = ref<number>();
const alipayForm = ref<string>();
const alipayFormRef = ref<HTMLDivElement>();
let wxLink = "";

onMounted(async () => {
  const product = await getMonthlyCard().catch(console.error);
  if (!product) return;
  productId.value = product.id;
});

const createTrade = async (isAliPay: boolean) => {
  if (!productId.value) return;
  let orderSourceEnum = 4;
  if (isAliPay) {
    orderSourceEnum = 3;
  }
  const trade = await getTradeForm(productId.value, orderSourceEnum);
  if (isAliPay) {
    alipayForm.value = trade.aliTrade;
  } else {
    wxLink = trade.wxTrade;
  }
};

const alipay = async () => {
  await createTrade(true);
  await nextTick(() => {
    const container = alipayFormRef.value;
    if (!container) return;
    container.querySelector("form")?.submit();
  });
};

const wxpay = async () => {
  await createTrade(false);
  if (!wxLink) {
    ElMessage.error("微信跳转链接缺失");
    return;
  }
  location.href = wxLink;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

.btn {
  border-radius: 4px;
  border: 1px solid #dddfe3;
  padding: 4px 10px;
  line-height: 20px;
  color: theme.$text-color-primary;
  background: unset;
  box-shadow: unset;
  outline: unset;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out;

  &:hover {
    color: theme.$color-primary;
    border-color: theme.$color-primary;
  }
}
</style>
