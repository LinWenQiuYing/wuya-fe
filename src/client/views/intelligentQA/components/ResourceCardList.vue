<template>
  <div class="card-list-wrapper">
    <div class="resource-card-list">
      <el-image
        v-for="(item, index) in [...images, ...pdfImagesUrl].slice(0, 2)"
        :key="index"
        class="image"
        :src="item"
        :zoom-rate="1.2"
        fit="cover"
        @click="onClick(item)"
      />
    </div>
    <div class="search-more-image" @click="onClickMoreImage">
      搜索更多图片
      <Right class="right-icon" />
    </div>
  </div>
  <el-dialog
    v-model="visible"
    class="images-dialog"
    append-to-body
    fullscreen
    style="background: rgb(44 54 77 / 70%)"
    @close="onCancel"
  >
    <el-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="正在搜索中..."
      element-loading-background="rgba(44, 54, 77, 0.5)"
      :gutter="80"
      class="el-row-wrapper"
      style="padding: 0 100px"
    >
      <el-col :span="16" class="el-col">
        <img :src="curImage" class="image-item-detail" />
      </el-col>
      <el-col :span="8" class="el-col">
        <div class="images-right">
          <el-input
            v-model="search"
            :prefix-icon="Search"
            class="search-image-input"
            placeholder="搜索图像描述/图中文字"
            @keydown.enter="(e: KeyboardEvent) => handleKeyEnter(e, onEnter)"
          ></el-input>
          <div class="waterfall">
            <div class="home-picture-cont">
              <div
                v-for="(item, index) in [...images, ...pdfImagesUrl]"
                :key="index"
                class="home-picture-cont-img"
                @click="onClick(item)"
              >
                <img :src="item" />
              </div>
            </div>
          </div>
          <div @click="loadMore" class="load-more">加载更多</div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Right, Search } from "@element-plus/icons-vue";
import useImages from "@/client/views/intelligentQA/hooks/useImages";
import { usePdfImagesUrl } from "@/client/hooks/useImages";
import { useIsLoading } from "@/client/hooks/useIsLoading";
import { ElMessage } from "element-plus";
import handleKeyEnter from "@/client/utils/handleKeyEnter";

const props = defineProps<{
  data: Record<string, any>;
}>();
const question = computed(() => props.data.question);
const getPdfImages = usePdfImagesUrl();
const visible = ref(false);
const index = ref(5);

const pdfImagesUrl = ref<string[]>([]);
const { images, getImages } = useImages();
const [loading, setLoading] = useIsLoading();

const search = ref();
const curImage = ref();

const onClick = (item) => {
  visible.value = true;
  curImage.value = item;
};
const onClickMoreImage = () => {
  visible.value = true;
  curImage.value = images.value?.[0];
};

const loadMore = () => {
  index.value = index.value + 5;
  getImages(question.value, index.value);
};

watch(
  () => props.data.answer.reference,
  (value, oldValue) => {
    const length = oldValue?.length || 0;
    if (!!value) {
      getPdfImages(value.slice(length)).then((result: string[]) => {
        pdfImagesUrl.value = length === 0 ? result : [...pdfImagesUrl.value, ...result];
      });
    } else {
      pdfImagesUrl.value = [];
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

watch(
  () => question.value,
  (value) => {
    if (value) {
      getImages(value);
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

const onEnter = async () => {
  if (search.value) {
    setLoading(true);
    await getImages(search.value, 5);
    setLoading(false);
  } else {
    ElMessage.error("不能为空");
  }
};
const onCancel = () => {
  visible.value = false;
};
</script>

<style scoped lang="scss">
@import "src/styles/theme";

.search-more-image {
  margin-top: $margin-md;
  padding: 0 $padding-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  font-size: $font-size-base;
  color: $text-color-primary;
  border: 1px dashed rgb(224 228 241 / 100%);
  border-radius: $border-radius-xxl;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.right-icon {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.resource-card-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 170px;
  grid-auto-flow: row;
  grid-gap: $padding-md;

  .image {
    width: 100%;
    height: 100%;
    border: 2px solid rgb(224 228 241 / 100%);
    border-radius: $border-radius-xl;
    overflow: hidden;
  }
}

:deep(.el-image__preview) {
  cursor: zoom-in;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.2);
    transform-origin: center center;
  }
}
</style>

<style lang="scss">
@import "src/styles/theme";

.el-row-wrapper {
  height: calc(100vh - 54px);
  padding: 0 100px;

  .el-col {
    height: 100%;
  }

  .image-item-detail {
    width: 100%;
    height: 100%;
    padding: 0 $padding-md;
    align-items: center;
    object-fit: contain;
  }

  .images-right {
    width: 100%;
    height: 100%;

    .search-image-input {
      --el-input-bg-color: #2d364d;
      --el-input-text-color: #fff;
      border-radius: 4px;
      height: 48px;
    }

    .load-more {
      cursor: pointer;
      height: 46px;
      line-height: 46px;
      padding: 0 $padding-md;
      color: $color-white;
      font-weight: 400;
      font-size: $font-size-base;
      border: 1px dashed rgb(255 255 255 / 100%);
      border-radius: 8px;
    }

    .waterfall {
      margin: $margin-md 0;
      height: calc(100% - 130px);
      overflow: auto;
    }

    .home-picture-cont {
      margin: $margin-md 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 3px;
      columns: 2;
      column-gap: 16px;

      .home-picture-cont-img {
        position: relative;
        margin-bottom: $margin-md;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: zoom-in;

        img {
          display: block;
          width: 100%;
          transition: all 0.3s;

          &:hover {
            transform: scale(1.2);
            transform-origin: center center;
          }
        }
      }
    }
  }
}
</style>
