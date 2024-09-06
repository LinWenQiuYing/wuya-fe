<template>
  <div :class="$style.set">
    <button type="button" :class="$style.back" @click="goBack">
      <slot name="back"></slot>
    </button>
    <span
      v-for="(item, index) in props.slotOptions"
      :key="index"
      :class="[$style[item.className], { isActive: isValid && item.name == 'confirm' }]"
      @click="confirm"
    >
      <slot :name="item.name"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted } from "vue";
import { optionType } from "@/client/components/types/component";
import { HistoryState } from "vue-router";

const emit = defineEmits(["confirm_"]);
const router = useRouter();
const route = useRoute();
const props = defineProps<{
  slotOptions: Array<optionType>;
  isValid?: boolean;
}>();

const goBack = async () => {
  const lastPage = (history.state as HistoryState)?.back || "";
  const currentPath = route.path;
  if (currentPath === "/settings/account" || currentPath === "/settings/profile") {
    if (typeof lastPage === "string" && lastPage.split("?")[0] === "/") {
      router.go(-1);
    } else {
      await router.replace({
        path: "/",
        query: { ...route.query },
      });
    }
  } else {
    router.go(-1);
  }
};
const confirm = () => {
  emit("confirm_");
};
onMounted(() => {});
</script>

<style lang="scss" module>
.set {
  height: 54px;
  padding: 0 20px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-weight: 500;
  font-size: 18px;
  color: #333;
}

.cancel {
  font-weight: 400;
  font-size: 16px;
  color: #666;
  position: relative;
  left: 10px;
}

.back {
  position: absolute;
  left: 10px;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
  z-index: 3;
}

.fill {
  width: 16px;
  height: 16px;
  color: #333;
  position: absolute;
  right: 15px;
}

.confirm {
  font-weight: 400;
  font-size: 16px;
  color: #999;
  position: absolute;
  right: 15px;

  &:global(.isActive) {
    color: #206cf1;
  }
}
</style>
