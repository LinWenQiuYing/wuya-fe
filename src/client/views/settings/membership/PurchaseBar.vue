<template>
  <div :class="$style._">
    <div :class="$style.main">
      <h4 :class="$style.title">{{ props.action }}月度会员</h4>
      <p :class="$style.desc">会员有效期一个月，到期不会自动续费</p>
      <div :class="$style.channels">
        <PayButton :icon="AlipayIcon" :active="isAlipay" @click="selectAlipay">支付宝</PayButton>
        <PayButton :icon="WechatPayIcon" :active="isWechatPay" @click="selectWeChatPay">微信</PayButton>
      </div>
      <PriceBar :discounted-price="discountedPrice" :original-price="originalPrice" />
      <TermsCheckbox v-model="agreed" :class="$style.checkbox" @change="onTermsChecked" />
    </div>
    <div :class="$style.qrCode">
      <img v-if="displayQRCode" :src="displayQRCode" alt="Quick Response Code" />
      <div v-if="qrCodeTips" :class="$style.mask">
        <div v-for="text in qrCodeTips" :key="text">{{ text }}</div>
      </div>
      <div v-else-if="loading" :class="$style.mask">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <button v-else-if="expired" type="button" title="点击刷新二维码" @click="refreshQRCodes">
        <RefreshIcon :class="$style.refresh" />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import PayButton from "./PayButton.vue";
import TermsCheckbox from "./TermsCheckBox.vue";
import PriceBar from "./PriceBar.vue";
import useExpired from "./useExpired";
import AlipayIcon from "@/client/icons/alipay.svg";
import WechatPayIcon from "@/client/icons/wxpay.svg";
import RefreshIcon from "@/client/icons/arc-arrow.svg";
import { getMonthlyCard, getPayQRCode } from "@/client/api/user";
import usePollingPayStatus from "./usePollingPayStatus";
import { Loading } from "@element-plus/icons-vue";

const props = defineProps<{
  action: string;
}>();

const emit = defineEmits<{
  pay: [];
}>();

const agreed = ref(false);
const originalPrice = ref<number>();
const discountedPrice = ref<number>();
const productId = ref<number>();
const alipayQRCode = ref<string>();
const wechatPayQRCode = ref<string>();
const orderId = ref<string>();
const loading = ref(false);

const { expired, resetExpired } = useExpired("5m");
const polling = usePollingPayStatus("5m");

type PayChannel = "alipay" | "wechat-pay";
const payChannel = ref<PayChannel>("alipay");

const isAlipay = computed(() => payChannel.value === "alipay");
const isWechatPay = computed(() => payChannel.value === "wechat-pay");

const displayQRCode = computed<string | undefined>(() => {
  if (isAlipay.value) return alipayQRCode.value;
  if (isWechatPay.value) return wechatPayQRCode.value;
  return undefined;
});

const qrCodeTips = computed<string[] | null>(() => {
  if (!agreed.value) return ["请先阅读并同意协议"];
  if (!orderId.value) return ["加载中..."];
  if (!displayQRCode.value) return ["支付方式不可用", "请尝试其它支付方式"];
  return null;
});

// 设置二维码
const setQRCodes = async (productId: number) => {
  const qrCodes = await getPayQRCode(productId).catch(console.error);
  if (!qrCodes) return;
  alipayQRCode.value = qrCodes.aliImageBytes;
  wechatPayQRCode.value = qrCodes.wxImageBytes;
  orderId.value = qrCodes.orderUuid;
};

// 刷新二维码
const refreshQRCodes = async () => {
  if (!productId.value) return;
  loading.value = true;
  await setQRCodes(productId.value);
  resetExpired();
  loading.value = false;
};

const selectAlipay = () => (payChannel.value = "alipay");
const selectWeChatPay = () => (payChannel.value = "wechat-pay");

const onTermsChecked = async (checked: boolean) => {
  if (!orderId.value) return;
  if (!checked) return polling.abort();
  const paid = await polling.run(orderId.value);
  if (!paid) return;
  emit("pay");
};

onMounted(async () => {
  const product = await getMonthlyCard().catch(console.error);
  if (!product) return;
  originalPrice.value = product.originalAmount;
  discountedPrice.value = product.actualAmount;
  productId.value = product.id;
  await setQRCodes(product.id);
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  background: #f6f8fe;
  border-radius: 6px;
  padding: 24px 6px 24px 20px;
  display: flex;

  :global {
    .el-checkbox {
      --el-checkbox-checked-text-color: inherit;
    }
  }
}

.main {
  flex: 1;
}

.title {
  margin: 0;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 24px;
}

.desc {
  margin: 3px 0 0;
  font-size: 14px;
  color: theme.$text-color-secondary;
  line-height: 22px;
}

.channels {
  display: flex;
  gap: 12px;
  margin: 25px 0 14px;
}

.qrCode {
  height: 170px;
  align-self: center;
  border-left: 1px solid #e0e4f1;
  display: grid;

  > img,
  > button,
  .mask {
    grid-column: 1;
    grid-row: 1;
    height: 126px;
    width: 126px;
    margin: auto 50px;
  }

  > button,
  .mask {
    background: #3d3d3d;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .mask {
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    user-select: none;
  }

  > button {
    border: unset;
    outline: unset;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
    color: #ddd;

    &:hover {
      color: #fff;
    }
  }

  :global(.is-loading) {
    font-size: 18px;
  }
}

.refresh {
  fill: currentColor;
  width: 20px;
}

.checkbox {
  margin-top: 30px;
  margin-bottom: 5px;
}
</style>
