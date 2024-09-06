<template>
  <div class="infomation-h5-tags">
    <Tabs v-model:active="active" @click-tab="onClickTab">
      <Tab title="推荐" name="recommend" />
      <Tab v-for="(tag, index) in showTagValue" :key="index" :title="tag" :name="tag" />
    </Tabs>
    <Icon name="plus" size="16px" @click="popupShow = true" />
    <Popup v-model:show="popupShow" position="right" closeable @click-close-icon="handleClosePopup">
      <div class="h5-tags-box">
        <div class="h5-tags-box-header">
          <div class="header-title">
            <span class="header-title-left">我的栏目</span>
            <Button v-if="isEdit" plain type="primary" @click="isEdit = false">完成</Button>
            <Button v-else plain type="primary" @click="isEdit = true">编辑</Button>
          </div>
          <div class="tags-content">
            <div class="tag disabled">推荐</div>
            <div v-for="(tag, index) in showTagValue" :key="index" :class="['tag', isEdit ? 'editing' : '']">
              <CloseIcon v-show="isEdit" @click="handleDeleteTag(tag)" />
              {{ tag }}
            </div>
          </div>
        </div>
        <div class="h5-tags-box-content">
          <div class="header-title">
            <span class="header-title-left">更多订阅</span>
          </div>
          <div v-for="tags in tagOptions" :key="tags.label" class="tags-box">
            <div class="tags-title">{{ tags.label }}</div>
            <div class="tags-content">
              <div v-for="(tag, index) in tags.children" :key="index" class="tag" @click="handleAddTag(tag)">
                {{ tag.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
import { setLabelsList } from "@/client/api/news";
import { TagItem } from "@/client/types/news";
import CloseIcon from "@/client/icons/close.svg";
import { Popup } from "vant";
import { computed, ref, watch } from "vue";
import { Button, Icon, Tab, Tabs } from "vant";
import { cloneDeep, isEqual } from "lodash-es";

const props = defineProps<{ options: TagItem[]; selectedTags: string[] }>();
const emits = defineEmits(["tagValueChange", "h5SingleTagChange"]);

const isEdit = ref<boolean>(false);
const tagValue = ref<string[]>([]);
// showTagValue为tagValue中去除一级标签的结果集
const showTagValue = computed(() => {
  const firstTagLabels = props.options.map((item: TagItem) => item.label);
  return tagValue.value.filter((item) => !firstTagLabels.includes(item));
});
const tagOptions = ref<TagItem[]>([]); // tagOptions保存所有未被选中的标签数据
const active = ref("recommend");
const popupShow = ref<boolean>(false);

const handleReturnNotSelectedTags = (options: TagItem[]) => {
  const result: TagItem[] = options.map((tags: TagItem) => {
    const children = tags.children?.filter((child) => !showTagValue.value.includes(child.label)) || [];
    if (children.length === 0 && !tagValue.value.includes(tags.label)) {
      // 表示当前一级标签的子标签全选了&&当前一级标签未被选中——则将当前一级标签的label加入tagValue
      tagValue.value.push(tags.label);
    } else if (children.length && tagValue.value.includes(tags.label)) {
      // 表示当前一级标签的子标签未全选&&当前一级标签被选中了——则将当前一级标签的label从tagValue中移除
      tagValue.value = tagValue.value.filter((item) => item !== tags.label);
    }
    return {
      ...tags,
      children,
    };
  });
  return result;
};

// 删除关注标签
const handleDeleteTag = (tag: string) => {
  tagValue.value = tagValue.value.filter((item) => item !== tag);
  tagOptions.value = handleReturnNotSelectedTags(cloneDeep(props.options));
};

// 添加关注标签
const handleAddTag = (tag: TagItem) => {
  if (!isEdit.value) return;
  tagValue.value.push(tag.label);
  tagOptions.value = handleReturnNotSelectedTags(cloneDeep(props.options));
};

// 保存标签
const handleSaveTags = async () => {
  const allTags: TagItem[] = [];
  props.options.map((tag: TagItem) => {
    allTags.push(tag);
    allTags.push(...(tag.children || []));
  });
  const tagArr: TagItem[] = allTags.filter((item) => tagValue.value.includes(item.label));
  const arr = tagArr.map((tag) => ({
    label_source: tag.source,
    label_name: tag.label,
    label_code: tag.value,
    effective_status: 1,
  }));
  await setLabelsList(arr);
};

// 点击关闭popup
const handleClosePopup = async () => {
  popupShow.value = false;

  if (!isEqual(cloneDeep(props.selectedTags), cloneDeep(tagValue.value))) {
    emits("tagValueChange", tagValue.value);
    // 保存标签
    await handleSaveTags();
  }
};

watch(
  () => props.selectedTags,
  (newVal: string[]) => {
    tagValue.value = [...newVal];
    tagOptions.value = handleReturnNotSelectedTags(cloneDeep(props.options));
  },
  { immediate: true },
);

const onClickTab = ({ name }: { name: string }) => {
  const tag = name === "recommend" ? [] : [name];
  emits("h5SingleTagChange", tag);
};
</script>

<style scoped lang="scss">
@-webkit-keyframes vibrate {
  0% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  50% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  100% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
}
@keyframes vibrate {
  0% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  50% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  100% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
}

.infomation-h5-tags {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 3px;
  position: relative;

  :deep(.van-tabs) {
    max-width: calc(100% - 31px);

    .van-tabs__wrap {
      height: 30px;
      padding: 0 15px;

      .van-tabs__nav {
        padding: 0 0 15px;

        .van-tab {
          padding: 0;
          min-width: 40px;
          margin-right: 18px;

          &:nth-last-of-type(2) {
            margin-right: 0;
          }

          &.van-tab--active {
            font-size: 16px;
            font-weight: bold;
          }

          .van-tab__text {
            height: 22px;
            line-height: 22px;
            padding-bottom: 8px;
          }
        }

        .van-tabs__line {
        }
      }
    }
  }

  :deep(.van-popup) {
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;

    .van-icon-cross {
      color: #404040;
      font-size: 16px;
    }

    .h5-tags-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .header-title {
        height: 22px;
        display: flex;
        margin-bottom: 14px;
        align-items: center;
        justify-content: space-between;

        &-left {
          font-size: 16px;
          color: #2d364d;
          font-weight: 600;
        }

        .van-button {
          width: 40px;
          height: 24px;
          font-size: 14px;
          padding: 0;
          text-align: center;
          color: #206cf1;
          border-color: #206cf1;
          border-radius: 2px;
        }
      }

      .tags-box {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .tags-title {
          width: 100%;
          height: 16px;
          line-height: 16px;
          font-size: 16px;
          margin-bottom: 15px;
          color: #2d364d;
        }
      }

      .tags-content {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tag {
          width: calc((100% - 16px) / 3);
          min-width: 105px;
          max-width: 200px;
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          color: #2d364d;
          text-align: center;
          background-color: #f4f4f8;
          position: relative;

          &.editing {
            animation: 0.3s linear 0s infinite normal both running vibrate;
          }

          &.disabled {
            color: #bbb;
          }

          svg {
            width: 16px;
            height: 16px;
            position: absolute;
            top: -4px;
            right: -4px;
          }
        }
      }

      &-header {
        padding: 40px 15px 15px;
        background: #fff;
        margin-bottom: 5px;
      }

      &-content {
        padding: 15px;
        background: #fff;
        flex: 1;
      }
    }
  }

  :deep(.van-icon-plus) {
    position: absolute;
    top: 3px;
    right: 15px;
    margin-bottom: 11px;
  }
}
</style>
