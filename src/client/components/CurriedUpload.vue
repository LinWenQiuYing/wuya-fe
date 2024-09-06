<template>
  <span :class="[props.class, $style._]" :title="title">
    <input
      v-if="!isInAndroidWeixin"
      ref="inputRef"
      type="file"
      multiple
      :accept="acceptableExtensions"
      :disabled="isAnonymous"
      @change="onChange"
    />
    <input v-else ref="inputRef" :disabled="isAnonymous" @click="weixinUploadShow = true" />
    <span :class="$style.trigger" @click="preUpload">
      <slot>
        <Transition name="fade" mode="out-in">
          <el-icon v-if="loading" :class="$style.loading" class="is-loading">
            <Loading />
          </el-icon>
          <ArrowTopIcon v-else :class="$style.placeholder" />
        </Transition>
      </slot>
    </span>
    <Popup v-model:show="weixinUploadShow" position="bottom" :class="$style.wxUploadPopup">
      <div v-for="(option, idx) in wxUploadInfo" :key="idx" :class="$style.uploadOption">
        <div>
          <component :is="option.icon" />
          <span>{{ option.name }}</span>
        </div>
        <div>{{ option.desc }}</div>
        <div v-if="idx === 0" :class="$style.seperator"></div>
        <input
          type="file"
          :class="$style.inputMask"
          :accept="option.accept"
          multiple
          @click="weixinUploadShow = false"
          @change="onChange"
        />
      </div>
      <button @click="weixinUploadShow = false">取消</button>
    </Popup>
  </span>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { checkDocUploadAvailable, getCloudSpace } from "@/client/api";
import { ref, computed } from "vue";
import { acceptableExtensions, wxUploadInfo } from "@/store/upload";
import ArrowTopIcon from "@/client/icons/arrow-top.svg";
import { Loading } from "@element-plus/icons-vue";
import isCloudAcceptableFile, { isFileTypeValid } from "@/utils/isCloudAcceptableFile";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import { Popup } from "vant";
import { isWeiXinBrower, isAndroid } from "@/utils/devices";

const props = defineProps<{
  class?: string;
}>();

const emit = defineEmits<{
  change: [File[]];
}>();

const inputRef = ref<HTMLInputElement>();
const loading = ref<boolean>(false);
const title = computed(() => (loading.value ? "正在检查上传服务是否可用" : "点击上传文件"));

// 文件列表的类型转换: FileList => File[]
const fileListToArray = (list: FileList): File[] => {
  const arr: File[] = [];
  for (let i = 0; i < list.length; i++) {
    arr.push(list[i]);
  }
  return arr;
};

// 上传之前, 检查是否拥挤和可以上传
const preUpload = () => {
  const input = inputRef.value;
  if (!input) return;
  input.click();
};

// 对文件大小进行检查
const isAcceptableFiles = (files: File[]) => {
  return files.every((file: File) => {
    const acceptableOrMessage = isCloudAcceptableFile(file);
    if (typeof acceptableOrMessage === "string") {
      ElMessage.warning(acceptableOrMessage);
      return false;
    }
    return acceptableOrMessage;
  });
};

const isFilesTypeValid = (files: File[]) => {
  const extensionArr = acceptableExtensions.split(",").map((item) => item.trim());
  return files.every((file: File) => {
    if (!isFileTypeValid(file, extensionArr)) {
      ElMessage.warning("文件格式错误，请检查文件格式");
      return false;
    }
    return true;
  });
};

const isInAndroidWeixin = isWeiXinBrower() && isAndroid();
const weixinUploadShow = ref(false);

const checkStorageCapacity = async (files: File[]) => {
  const cloudSpace = await getCloudSpace().catch(console.log);
  if (!cloudSpace) return false;
  // 特殊角色 total为 -1
  if (cloudSpace.total < 1) return true;
  const remaining = cloudSpace.total - cloudSpace.used;
  const fileSizes = files.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.size;
  }, 0);
  return remaining > fileSizes;
};

// 派生上传事件
const onChange = async (event: Event) => {
  const target = <HTMLInputElement>event.target;
  const fileList = target.files;
  if (!fileList) return;
  if (loading.value) return;
  loading.value = true;
  const available = await checkDocUploadAvailable().catch(console.warn);
  loading.value = false;
  if (!available) {
    ElMessage.warning("当前处于高峰时段，暂时无法上传文件，请稍后重试");
    return;
  }
  const fileArray = fileListToArray(fileList);
  const acceptable = isAcceptableFiles(fileArray);
  if ((isInAndroidWeixin && !isFilesTypeValid(fileArray)) || !acceptable) {
    return;
  }
  const haveSpace = await checkStorageCapacity(fileArray);
  if (!haveSpace) {
    ElMessage.error("当前上传文件超出剩余空间大小");
    return;
  }

  emit("change", fileArray);
  target.value = "";
};
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  color: theme.$text-color-primary;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: theme.$color-primary;
  }

  input {
    display: none;
  }

  :global {
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}

.trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  width: 20px;
  fill: currentColor;
}

.loading {
  font-size: 16px;
}

.wxUploadPopup {
  background-color: #fff;

  .uploadOption {
    padding: 17px;
    position: relative;

    div:first-child {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
      color: #2d364d;
    }

    div:nth-child(2) {
      margin-top: 6px;
      font-size: 12px;
      color: #9ba0ab;
      line-height: 17px;
    }
  }

  .seperator {
    margin: 17px 0 -17px;
    height: 1px;
    background: #eee;
  }

  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  button {
    width: 100%;
    height: 44px;
    background-color: #fff;
    color: #306bec;
    font-size: 16px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top: 1px solid #e5e5e5;
  }

  .inputMask {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
