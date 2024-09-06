<template>
  <span :class="$style.time_icon" @click="handleClickIcon">
    <TagIcon :fill="!drawerVisible ? '#09244B' : '#086DF4'" />
  </span>
  <el-drawer
    v-model="drawerVisible"
    :show-close="false"
    :class="$style.tags_drawer"
    :size="386"
    @close="handleChange"
  >
    <template #header>
      <div :class="$style.drawer_header">
        <RetractIcon @click="handleChange" />
        <span>设置关注的类别</span>
      </div>
      <span :class="$style.drawer_clear" @click="handleClear">清空筛选条件</span>
    </template>
    <template #default>
      <div :class="$style.drawer_content">
        <el-scrollbar :class="[$style.tag_list, $style.parent]">
          <li
            v-for="(item, index) in tagOptions"
            :key="index"
            :class="[$style.tag_list_item, index === activeIndex ? $style.active : '']"
            @click="handleSelect(index)"
          >
            <div :class="$style.item_left">
              <span :class="$style.item_label">{{ item.label }}</span>
              <span v-show="selectedChild(item).length" :class="$style.item_count">
                {{ selectedChild(item).length }}
              </span>
            </div>
            <div :class="$style.item_right" @click="handleSelectAll(item)">
              <el-tooltip v-if="item.isSelected" content="取消全选子标签" placement="top">
                <Check color="#1675F5" />
              </el-tooltip>
              <el-tooltip v-else content="全选子标签" placement="top">
                <Plus />
              </el-tooltip>
            </div>
          </li>
        </el-scrollbar>
        <el-scrollbar :class="[$style.tag_list, $style.child]">
          <li
            v-for="item in tagOptions[activeIndex].children"
            :key="item.value"
            :class="$style.tag_list_item"
            @click="handleSelectChild(item)"
          >
            <el-image
              :src="item.image_url"
              lazy
              fit="cover"
              @error="item.isImageShow = false"
              @load="item.isImageShow = true"
            />
            <span :class="$style.item_label" :style="{ color: item.isImageShow ? '#fff' : '#6d7587' }">{{
              item.label
            }}</span>
            <div v-show="item.isImageShow" :class="$style.item_cover"></div>
            <span :class="[$style.tag_list_item_icon, item.isSelected ? $style.active : '']">
              <span :class="$style.icon_box">
                <Check v-if="item.isSelected" />
                <Plus v-else />
              </span>
            </span>
          </li>
        </el-scrollbar>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { setLabelsList } from "@/client/api/news";
import RetractIcon from "@/client/icons/retract.svg";
import TagIcon from "@/client/icons/tag.svg";
import { TagItem } from "@/client/types/news";
import { Check, Plus } from "@element-plus/icons-vue";
import { cloneDeep, isEqual } from "lodash-es";
import { computed, ref, watchEffect } from "vue";

const props = defineProps<{ options: TagItem[]; selectedTags: string[]; visible: boolean }>();
const emits = defineEmits(["tagValueChange", "visibleChange", "timeVisibleChange"]);

const drawerVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("visibleChange", val);
  },
});
const tagValue = ref<string[]>([]);
const tagOptions = ref<TagItem[]>([]);
const activeIndex = ref<number>(0);

watchEffect(() => {
  tagValue.value = [...props.selectedTags];
  tagOptions.value = props.options;
});

const handleClickIcon = () => {
  drawerVisible.value = true;
  emits("timeVisibleChange", false);
};

// 点击父标签
const handleSelect = (index: number) => {
  activeIndex.value = index;
};

// 点击选中子标签
const handleSelectChild = (item: TagItem) => {
  if (item.isSelected) {
    item.isSelected = false;
    tagValue.value = tagValue.value.filter((label) => label !== item.label);
  } else {
    item.isSelected = true;
    tagValue.value.push(item.label);
  }
};

// 监听子标签是否全选
const selectedChild = (item: TagItem) => {
  const result: TagItem[] = item.children?.filter((child) => tagValue.value.includes(child.label)) || [];
  if (result.length === item.children?.length) {
    item.isSelected = true;
    // 如果子标签全选，则将父标签加入选中列表
    if (!tagValue.value.includes(item.label)) {
      tagValue.value.push(item.label);
    }
  } else {
    item.isSelected = false;
    // 如果子标签不全选，则将父标签从选中列表移除
    if (tagValue.value.includes(item.label)) {
      tagValue.value = tagValue.value.filter((label) => label !== item.label);
    }
  }
  return result;
};

// 点击 全选/取消全选 该标签的子标签
const handleSelectAll = (tag: TagItem) => {
  const target = tagOptions.value.find((item) => item.label === tag.label);

  if (tagValue.value.includes(tag.label)) {
    // 取消全选
    const tagArr =
      tag.children?.map((child) => {
        child.isSelected = false;
        return child.label;
      }) || [];
    tagArr.push(tag.label);
    tagValue.value = tagValue.value.filter((item) => !tagArr.includes(item));
  } else {
    // 全选
    tagValue.value.push(tag.label);
    tag.children?.forEach((child) => {
      child.isSelected = true;
      tagValue.value.push(child.label);
    });
  }
  if (!target) return;
  target.isSelected = !target.isSelected;
};

// 清空标签
const handleClear = () => {
  tagValue.value = [];
  tagOptions.value.forEach((item) => {
    item.isSelected = false;
    item.children?.forEach((child) => {
      child.isSelected = false;
    });
  });
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

// 关闭抽屉并且更新tagValue
const handleChange = async () => {
  drawerVisible.value = false;
  if (!isEqual(cloneDeep(props.selectedTags), cloneDeep(tagValue.value))) {
    emits("tagValueChange", tagValue.value);
    // 保存标签
    await handleSaveTags();
  }
};
</script>

<style module lang="scss">
.time_icon {
  width: 28px;
  height: 28px;
  border: 1px solid #ced2df;
  border-radius: 15px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
}

.tags_drawer {
  :global {
    .el-drawer__header {
      height: 72px;
      padding-top: 0;
      margin-bottom: 0;
      border: 0;
    }

    .el-drawer__body {
      padding: 0;
      overflow: hidden;
    }
  }

  .drawer_header {
    font-size: 16px;
    font-weight: bold;
    color: #2d364d;

    svg {
      cursor: pointer;
    }

    span {
      margin-left: 16px;
    }
  }

  .drawer_clear {
    color: #086df4;
    font-size: 14px;
    cursor: pointer;
  }

  .drawer_content {
    display: flex;
    height: 100%;
    overflow: hidden;

    .tag_list {
      height: 100%;

      &.parent {
        width: 140px;
        background: #f8f9fc;

        .tag_list_item {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 22px;

          &.active {
            font-weight: bold;
            background: #dfeafb;
          }

          &:hover {
            background: #edeff3;
          }

          .item_count {
            color: #b3b9c7;
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }

      &.child {
        padding: 0 20px;
        width: calc(100% - 140px);

        .tag_list_item {
          height: 70px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;

          :global {
            .el-image {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }

          .item_label {
            position: absolute;
            bottom: 6px;
            left: 10px;
            font-size: 14px;
            z-index: 9;
          }

          .item_cover {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background-image: linear-gradient(to bottom, transparent 0, black 100%);
          }

          &_icon {
            position: absolute;
            top: 0;
            right: 0;
            width: 23px;
            height: 23px;
            color: #fff;
            background: #2c3553;
            border-bottom-left-radius: 23px;

            .icon_box {
              width: 11px;
              height: 11px;
              display: inline-block;
              position: relative;
              top: 0;
              left: 8px;
            }

            &.active {
              background: #056def;
            }
          }
        }
      }

      &_item {
        cursor: pointer;
        position: relative;

        .item_left {
          font-size: 14px;
          color: #2d364d;
        }

        .item_right {
          color: #2d364d;
          width: 14px;
          height: 14px;

          svg:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
