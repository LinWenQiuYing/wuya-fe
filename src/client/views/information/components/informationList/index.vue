<template>
  <ListSearch
    :options="options"
    :selected-tags="tagValue"
    @search-val-change="searchValChange"
    @search-time-change="searchTimeChange"
    @sort-type-change="sortTypeChange"
    @tag-value-change="tagValueChange"
    @get-news-list="getNewsList"
  />
  <H5Tags
    v-if="isMobile"
    :options="options"
    :selected-tags="tagValue"
    @tag-value-change="tagValueChange"
    @h5-single-tag-change="h5SingleTagChange"
  />
  <el-skeleton v-if="initLoading || data.length" :loading="initLoading" animated :rows="10">
    <template #template>
      <el-skeleton-item style="width: 80px; margin-left: 10px" variant="h1" />
      <div v-for="(_, index) in new Array(5).fill(1)" :key="index" :class="$style.skeleton_box">
        <el-skeleton-item variant="image" :class="$style.skeleton_img" />
        <div :class="$style.skeleton_content">
          <el-skeleton-item variant="text" :class="$style.skeleton_title" />
          <el-skeleton-item variant="text" :class="$style.skeleton_text" />
          <el-skeleton-item variant="text" :class="$style.skeleton_btn" />
        </div>
      </div>
    </template>
    <template #default>
      <ul
        ref="ulRef"
        v-infinite-scroll="load"
        :class="[$style.information_list, isMobile ? $style.h5 : '']"
        :infinite-scroll-distance="1"
        :infinite-scroll-disabled="isLoading"
      >
        <InformationListItem
          v-for="(item, index) in data"
          :key="index"
          :data="item"
          :is-result="!!searchVal"
        />
        <li v-if="isLoading">
          <el-skeleton-item style="width: 100px; height: 100px" variant="image" />
          <el-skeleton animated style="margin-left: 20px" />
        </li>
      </ul>
    </template>
  </el-skeleton>
  <el-empty v-else description="暂无内容" />
</template>

<script setup lang="ts">
import { getMyLablesTree, getMyRealTime } from "@/client/api/news";
import { LabelProps, NewsProps, TagItem } from "@/client/types/news";
import { isMobile } from "@/config";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import InformationListItem from "./InformationListItem.vue";
import ListSearch from "./ListSearch.vue";
import H5Tags from "./H5Tags.vue";

const today = dayjs().format("YYYY-MM-DD");
const dayago_6 = dayjs().subtract(6, "day").format("YYYY-MM-DD");
const ulRef = ref();
const data = ref<NewsProps[]>([]);
const offset = ref<number>(0);
const interest = ref<1 | 0>(1); // 1表示关注  0 表示关注取反
const isLoading = ref<boolean>(true);
const initLoading = ref<boolean>(true);
const searchVal = ref<string>("");
const searchTime = ref<string[]>([dayago_6, today]);
const sortType = ref<"desc" | "asc">("desc");
const tagValue = ref<string[]>([]);
const h5SingleTag = ref<string[]>([]); // h5端单选标签
const options = ref<TagItem[]>([]);

const searchValChange = (val: string) => {
  searchVal.value = val;
};

const searchTimeChange = async (val: string[]) => {
  let times = [];
  if (val[0] > val[1]) {
    times = [val[1], val[0]];
  } else {
    times = val;
  }
  if (times[0] === searchTime.value[0] && times[1] === searchTime.value[1]) return;
  searchTime.value = times;
  await getNewsList();
};

const sortTypeChange = (val: "desc" | "asc") => {
  sortType.value = val;
};

const tagValueChange = async (val: string[]) => {
  tagValue.value = val;
  h5SingleTag.value = [];
  await getNewsList();
};

const h5SingleTagChange = async (val: string[]) => {
  h5SingleTag.value = val;
  await getNewsList();
};

const getNewsList = async () => {
  // 初始化
  offset.value = 0;
  data.value = [];
  isLoading.value = true;
  initLoading.value = true;
  interest.value = tagValue.value.length ? 1 : 0;
  try {
    const res = await getMyRealTime({
      offset: offset.value,
      start_date: searchTime.value.length ? searchTime.value[0] : undefined,
      end_date: searchTime.value.length ? searchTime.value[1] : undefined,
      content: searchVal.value ? searchVal.value : undefined,
      orderby: sortType.value,
      news_labels: isMobile && h5SingleTag.value.length ? h5SingleTag.value : tagValue.value,
      interest: interest.value,
    });
    offset.value = res?.offset || 0;
    isLoading.value = false;
    initLoading.value = false;
    if (!res || !res?.news_list.length) return;
    data.value = res.news_list;
  } catch {
    isLoading.value = false;
    initLoading.value = false;
    ElMessage.error("获取资讯流失败！");
  }
};

// 生成级联下拉选项
const getAllOptions = (arr: LabelProps[]) => {
  const result: TagItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const children = item.children ? getAllOptions(item.children) : undefined;
    result.push({
      label: item.label_name,
      value: item.label_code,
      keywords: item.key_word,
      source: item.label_source,
      children,
      has_effect_child: item.has_effect_child === 1 ? true : false,
      isSelected: item.status === 1,
      image_url: item.image_url,
      isImageShow: false,
    });
  }
  return result;
};

const getOptions = (arr: LabelProps[]) => {
  const result: TagItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.status === 1 || item.has_effect_child === 1) {
      const children = item.children ? getOptions(item.children) : undefined;
      result.push({
        label: item.label_name,
        value: item.label_code,
        keywords: item.key_word,
        source: item.label_source,
        children,
        has_effect_child: item.has_effect_child === 1 ? true : false,
        isSelected: item.status === 1,
        image_url: item.image_url,
        isImageShow: false,
      });
    }
  }
  return result;
};

// 辅助函数来递归探索子层级
const exploreChildren = (children: TagItem[], output: string[] = []) => {
  // 遍历树中的每个节点
  children.forEach((child: TagItem) => {
    // 将当前节点的id添加到路径中
    const currentPath = child.label;

    // 如果当前节点有子节点，则递归调用转换函数
    if (child.children && child.has_effect_child) {
      exploreChildren(child.children, output);
      if (child.isSelected) output.push(currentPath);
    } else {
      // 如果当前节点没有子节点，将路径添加到结果数组中
      output.push(currentPath);
    }
  });
};

// 获取级联选项
const getCascaderOptions = async () => {
  try {
    const res = await getMyLablesTree();
    let selectedOptions = [];
    if (
      !res ||
      !res[-1] ||
      !res[-1].children ||
      JSON.stringify(res[-1].children) === "{}" ||
      Object.keys(res[-1].children).length === 0
    ) {
      options.value = [];
      tagValue.value = [];
    } else {
      options.value = getAllOptions(res[-1].children);
      selectedOptions = getOptions(res[-1].children);
      const result: string[] = [];
      exploreChildren(selectedOptions, result);
      tagValue.value = result;
    }
    await tagValueChange(tagValue.value);
  } catch {}
};

const load = async () => {
  if (offset.value === 0 && interest.value === 1) {
    interest.value = 0;
  } else if (offset.value === 0) {
    return;
  }
  isLoading.value = true;
  try {
    const res = await getMyRealTime({
      offset: offset.value,
      start_date: searchTime.value.length ? searchTime.value[0] : undefined,
      end_date: searchTime.value.length ? searchTime.value[1] : undefined,
      content: searchVal.value ? searchVal.value : undefined,
      orderby: sortType.value,
      news_labels: isMobile && h5SingleTag.value.length ? h5SingleTag.value : tagValue.value,
      interest: interest.value,
    });
    offset.value = res?.offset || 0;
    isLoading.value = false;
    if (!res || !res?.news_list.length) return;
    data.value.push(...res.news_list);
  } catch {
    isLoading.value = false;
    ElMessage.error("获取资讯流失败！");
  }
};

onMounted(async () => {
  await getCascaderOptions();
});
</script>

<style lang="scss" module>
@import "src/styles/theme";

.information_title {
  font-weight: bold;
  font-size: $font-size-lg;
  color: #2d364d;
  line-height: 24px;
}

.information_list {
  height: 100%;
  overflow-y: auto;
  flex: 1;

  &.h5 {
    padding: 15px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.cat_icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  vertical-align: text-bottom;
}

.herder_time {
  font-size: 14px;
  color: #6d7587;
}

.skeleton_box {
  display: flex;
  margin: 10px;
}

.skeleton_img {
  width: 92px;
  height: 92px;
}

.skeleton_content {
  flex: 1;
  margin-left: 15px;
  height: 92px;
  display: flex;
  flex-direction: column;

  .skeleton_title {
    height: 26px;
  }

  .skeleton_text {
    flex: 1;
    margin: 5px 0;
  }

  .skeleton_btn {
    height: 16px;
    width: 50px;
  }
}
</style>
