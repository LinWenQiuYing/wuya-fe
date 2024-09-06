<template>
  <div class="card">
    <img class="card-img" :src="data.IconImg" alt="##" />
    <h4 class="card-h4">{{ data.title }}</h4>
    <p class="card-p">{{ data.content }}</p>
    <div class="card-count">
      <HeartIcon class="love-icon" />
      {{ data.count }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import staffTrainPng from "@/admin/assets/image/staff_train.png";
import HeartIcon from "@/admin/icons/heart.svg";
import { CardState } from "@/admin/types/appStore";

const props = withDefaults(
  defineProps<{
    data: CardState;
  }>(),
  {
    data: {
      IconImg: staffTrainPng,
      title: "标题",
      content: "内容",
      count: 1000,
    },
  },
);

const data = ref<CardState>({
  IconImg: staffTrainPng,
  title: "标题",
  content: "内容",
  count: 1000,
});

watch(
  () => props.data,
  () => {
    if (props.data && Object.keys(data).length > 0) {
      data.value = props.data;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.card {
  width: 24%;
  height: 190px;
  padding: 12px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
  }

  &-img {
    width: 50px;
    height: 50px;
  }

  &-h4 {
    height: 22px;
    margin: 4px 0;
    font-size: 16px;
    color: #2d364d;
    line-height: 24px;
    font-weight: 700;
  }

  &-p {
    flex: 1;
    font-size: 14px;
    color: #2d364d;
    line-height: 22px;
    font-weight: 400;
    opacity: 0.7;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; //行数需设置
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

.love-icon {
  width: 14px;
  height: 14px;
  fill: #e5404f;
}

.card-count {
  font-size: 14px;
}
</style>
