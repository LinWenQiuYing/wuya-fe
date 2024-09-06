<template>
  <div v-if="!isSearch" :class="[$style.list_search, isMobile ? $style.h5 : '']">
    <el-input
      v-if="isMobile"
      ref="inputRefh5"
      v-model="searchVal"
      :class="$style.list_search_input"
      placeholder="搜索实讯资讯"
      :prefix-icon="Search"
      @keyup.enter="handleSearch"
    />
    <el-input
      v-else
      :class="$style.list_search_input"
      placeholder="搜索实讯..."
      :suffix-icon="Search"
      readonly
      @click="handleClickSearch"
    />
    <CalendarH5Icon v-if="isMobile" :class="$style.list_search_icon_btn" @click="handleSelectTime" />
    <Popup
      v-if="isMobile"
      v-model:show="popupShow"
      position="bottom"
      :style="{ height: '400px' }"
      @close="handleClosePopup"
    >
      <div :class="$style.date_picker_header">选择日期</div>
      <div :class="$style.date_range_inputs">
        <el-input
          v-model="searchTime[0]"
          style="width: 240px"
          placeholder="开始日期"
          :suffix-icon="Calendar"
          readonly
          :class="currentDateType === 'start' ? 'active' : ''"
          @click="handleClickInput('start')"
        />
        &nbsp;~&nbsp;
        <el-input
          v-model="searchTime[1]"
          style="width: 240px"
          placeholder="结束日期"
          :suffix-icon="Calendar"
          readonly
          :class="currentDateType === 'end' ? 'active' : ''"
          @click="handleClickInput('end')"
        />
      </div>
      <DatePicker
        v-show="datepickerShow"
        v-model="currentDate"
        :max-date="nowDate"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </Popup>

    <div v-if="!isMobile" :class="$style.list_search_wrap">
      <span :class="$style.now_time">{{ nowTime }}</span>
      <el-popover
        :visible="timeVisible"
        placement="bottom"
        :width="322"
        :popper-class="$style.date_popover"
        :offset="-40"
      >
        <template #reference>
          <span :class="$style.time_icon" @click="handleClickTime">
            <CalendarIcon :fill="!timeVisible ? '#2D364D' : '#086DF4'" />
          </span>
        </template>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            ref="datePickerRef"
            v-model="searchTime"
            type="daterange"
            range-separator="~"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :popper-class="$style.date_picker"
            teleported
            :disabled-date="disabledDate"
          />
        </el-config-provider>
      </el-popover>
      <PcTags
        :options="options"
        :visible="drawerVisible"
        :selected-tags="selectedTags"
        @tag-value-change="tagValueChange"
        @visible-change="visibleChange"
        @time-visible-change="timeVisibleChange"
      />
    </div>
    <!-- <div v-else :class="$style.list_search_icon_btn" @click="handleNewChat">
      <NewChatIcon />
    </div> -->
  </div>
  <div v-else :class="[$style.list_search, $style.active]">
    <el-input
      ref="inputRef"
      v-model="searchVal"
      :class="$style.list_search_content"
      placeholder="搜索实讯..."
      :prefix-icon="Search"
      @keyup.enter="handleSearch"
    />
    <div :class="$style.search_btn">
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
  <div v-if="!isMobile" v-show="isTips && !isSearch" :class="$style.search_tips">
    您当前阅读的是
    <span :class="$style.search_time">{{ searchTime[0] }} ~ {{ searchTime[1] }}</span>
    的内容，返回最近七天请点击 <span :class="$style.tips_link" @click="handleBackTime">这里</span>。
  </div>
</template>

<script setup lang="ts">
import useCurrentTime from "@/client/hooks/useCurrentTime";
import CalendarIcon from "@/client/icons/calendar.svg";
import CalendarH5Icon from "@/client/icons/calendar_h5.svg";
import NewChatIcon from "@/client/icons/new_chat.svg";
import PcTags from "./PcTags.vue";
import { TagItem } from "@/client/types/news";
import { isMobile } from "@/config";
import { Calendar, Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { DatePicker, Popup } from "vant";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

defineProps<{ options: TagItem[]; selectedTags: string[] }>();
const emit = defineEmits([
  "searchValChange",
  "searchTimeChange",
  "sortTypeChange",
  "tagValueChange",
  "getNewsList",
]);

// 当前日期与6天前的日期
const nowDate = new Date();
const today = dayjs().format("YYYY-MM-DD");
const dayago_6 = dayjs().subtract(6, "day").format("YYYY-MM-DD");

const popupShow = ref<boolean>(false);
const datepickerShow = ref<boolean>(false);
const isPickerDateFinish = ref<boolean>(false);
const searchVal = ref<string>("");
const searchTime = ref<string[]>([dayago_6, today]);
const currentDate = ref<string[]>(today.split("-"));
const currentDateType = ref<"start" | "end">("start");
const isSearch = ref<boolean>(false); // 是否正在搜索状态，默认否
const isResult = ref<boolean>(false); // 是否有搜索结果，默认否
const isTips = ref<boolean>(false); // 是否进行过时间切换，默认否
const { nowTime } = useCurrentTime();
const inputRef = ref<any>(null);
const inputRefh5 = ref<any>(null);
const datePickerRef = ref<any>(null);

const timeVisible = ref<boolean>(false);
const drawerVisible = ref<boolean>(false);

watch(timeVisible, (newVal) => {
  if (!newVal) {
    datePickerRef.value.handleClose();
  }
});

watch(searchTime, (newVal) => {
  handleWatchSearchTimeChange(newVal);
});

const tagValueChange = (value: string[]) => {
  emit("tagValueChange", value);
};

const visibleChange = (value: boolean) => {
  drawerVisible.value = value;
};

const timeVisibleChange = (value: boolean) => {
  timeVisible.value = value;
};

const disabledDate = (data: Date) => {
  return (
    dayjs(data).format("YYYY-MM-DD") > dayjs().format("YYYY-MM-DD") ||
    dayjs(data).format("YYYY-MM-DD") < dayjs("2024-04-15").format("YYYY-MM-DD")
  );
};

// 点击空白处关闭popover弹窗
const handleClickEmpty = (e: MouseEvent) => {
  const dateDom = document.getElementsByClassName("el-picker__popper")[0];
  if (dateDom && e.target !== dateDom && !dateDom.contains(e.target) && timeVisible.value) {
    timeVisible.value = false;
  }
};

const handleBackTime = () => {
  isTips.value = false;
  searchTime.value = [dayago_6, today];
};

// 点击搜索输入框
const handleClickSearch = async () => {
  isSearch.value = true;
  await nextTick(() => {
    inputRef.value.focus();
  });
};

// 取消搜索
const handleCancel = () => {
  isSearch.value = false;
  searchVal.value = "";
  emit("searchValChange", "");
  if (isResult.value) {
    isResult.value = false;
    emit("getNewsList");
  }
};

// 点击搜索
const handleSearch = () => {
  if (inputRefh5.value) {
    inputRefh5.value.blur();
  }
  isResult.value = true;
  emit("searchValChange", searchVal.value);
  emit("getNewsList");
};

// 点击时间图标
const handleClickTime = async () => {
  timeVisible.value = true;
  drawerVisible.value = false;
  await nextTick(() => {
    datePickerRef.value.handleOpen();
  });
};

// 点击跳转对话
const router = useRouter();
const handleNewChat = async () => {
  await router.push("/");
};

// 移动端点击选择时间段
const handleSelectTime = () => {
  popupShow.value = true;
  handleClickInput("start");
};

// 取消
const onCancel = () => {
  datepickerShow.value = false;
};

// 时间选择改变
const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  isPickerDateFinish.value = false;
  if (currentDateType.value === "start") {
    searchTime.value = [
      `${selectedValues[0]}-${selectedValues[1]}-${selectedValues[2]}`,
      searchTime.value[1],
    ];
  } else {
    searchTime.value = [
      searchTime.value[0],
      `${selectedValues[0]}-${selectedValues[1]}-${selectedValues[2]}`,
    ];
  }
  datepickerShow.value = false;
};

// 点击时间输入框
const handleClickInput = (type: "start" | "end") => {
  currentDateType.value = type;
  if (type === "start") {
    currentDate.value = searchTime.value[0].split("-");
  } else {
    currentDate.value = searchTime.value[1].split("-");
  }
  datepickerShow.value = true;
};

// 点击空白区域
const handleClosePopup = () => {
  popupShow.value = false;

  // 移动端是否完成了选择时间
  isPickerDateFinish.value = true;
  handleWatchSearchTimeChange(searchTime.value);
};

const handleWatchSearchTimeChange = (newVal: string[]) => {
  if (!newVal || !newVal.length) return;
  if (newVal[0] > newVal[1]) {
    newVal = [newVal[1], newVal[0]];
  }
  if (isMobile && !isPickerDateFinish.value) return;
  emit("searchTimeChange", newVal);
  timeVisible.value = false;
  if (newVal[0] === dayago_6 && newVal[1] === today) {
    isTips.value = false;
  } else {
    isTips.value = true;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickEmpty, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickEmpty, true);
});
</script>

<style lang="scss" module>
.list_search {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  box-sizing: content-box;
  margin-bottom: 12px;

  &.h5 {
    padding: 15px 15px 20px 55px;
    margin-bottom: 0;
    height: 40px;
  }

  &.active {
    border-bottom: 1px solid #0a6efa;
    height: 45px;
  }

  &_input {
    width: 100%;
    flex: 1;

    :global {
      .el-input__wrapper {
        border-radius: 20px;
        height: 40px;
      }
    }
  }

  &_content {
    width: calc(100% - 150px);

    :global {
      .el-input__wrapper {
        border: 0;
        box-shadow: none !important;

        .el-input__inner {
          border-radius: 0;
        }

        &:hover {
          box-shadow: none !important;
        }
      }
    }
  }

  &_wrap {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #6d7587;

    .now_time {
      font-size: 14px;
    }

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
  }

  &_icon_btn {
    display: flex;
    margin-left: 20px;
    cursor: pointer;
  }

  .search_btn {
    button {
      height: 30px;
    }
  }
}

.search_tips {
  font-size: 14px;
  text-align: left;
  padding-left: 16px;
  color: #2d364d;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  background: rgba(8, 109, 244, 0.08);
  border: 1px solid rgba(8, 109, 244, 0.2);

  .search_time {
    // font-weight: 600;
  }

  .tips_link {
    color: #086df4;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
.date_popover {
  visibility: hidden;
}

.date_picker {
  :global {
    .el-popper__arrow {
      display: none;
    }
  }
}

.date_picker_header {
  font-size: 16px;
  text-align: center;
  height: 44px;
  line-height: 44px;
}

.date_range_inputs {
  display: flex;
  align-items: center;
  padding: 0 16px;

  :global {
    .el-input {
      &.active {
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #1776ff inset;
        }
      }
    }
  }
}
</style>
