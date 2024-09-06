<template>
  <div class="content_top">
    <el-button type="primary" @click="createKnow">新建知识库</el-button>
    <div>
      <el-input v-model="searchName" type="text" class="search_input" placeholder="请输入关键字"> </el-input>
      <el-button class="search_button" @click="searchData">
        <SearchIcon class="search_icon" />
      </el-button>
    </div>
  </div>
  <div class="card_wrapper">
    <el-card
      v-for="(item, index) in filterData"
      :key="index"
      class="card-item"
      shadow="hover"
      @click="() => checkKnowledge(item)"
    >
      <img class="image" :src="IMAGE_URL[index % 6]" />
      <h4 class="title" :title="item.name">{{ item.name }}</h4>
      <div class="detail" :title="item.description">
        {{ item.description }}
      </div>
      <div class="statistics" title="文件数量">
        <FileIcon class="file_icon" />
        <span>
          {{ item.count }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getAdminKnowList } from "@/admin/api/knowledge";
import { BaseInfoProp } from "@/admin/types";
import { IMAGE_URL } from "@/admin/view/homePage/const";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import SearchIcon from "@/admin/icons/search.svg";
import FileIcon from "@/admin/icons/file-filled.svg";

const searchName = ref();
const cardData = ref<BaseInfoProp[]>([]);
const filterData = ref<BaseInfoProp[]>([]);
const router = useRouter();

// 获取文档类的知识库
const getCardData = async () => {
  const res = (await getAdminKnowList()) as { data: BaseInfoProp[] };
  res.data.reverse();
  cardData.value = res.data.slice(0, 10);
  filterData.value = res.data.slice(0, 10);
};

// 筛选知识库
const searchData = () => {
  const val = searchName.value.trim();
  if (val) {
    const data = cardData.value.filter((item) => item.name.indexOf(val) !== -1);
    filterData.value = data;
  } else {
    filterData.value = cardData.value;
  }
};

// 创建知识库
const createKnow = () => {
  router.push("/admin/knowledge/createKnowledge");
};

// 选择知识库
const checkKnowledge = (data: BaseInfoProp) => {
  store.commit("knowledge/SET_CURRENT_DATA", data);
  router.push("/admin/knowledge");
};

onMounted(() => {
  getCardData();
});
</script>

<style scoped>
.content_top {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search_button {
    width: 34px;
    height: 34px;
    background: #f8fafe;
    border-radius: 2px 0 0 2px;

    .search_icon {
      fill: #2d364d;
      width: 18px;

      &:hover {
        color: #1677ff;
      }
    }
  }

  .search_input {
    width: 300px;
  }
}

.card_wrapper {
  height: calc(100% - 92px);
  overflow: auto;
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: row;
  grid-gap: 16px;
}

.card-item {
  height: 200px;
  border-radius: 8px;
}

.image {
  width: 52px;
  height: 52px;
}

.title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 16px;
  color: #2d364d;
  line-height: 30px;
  font-weight: 700;
  cursor: pointer;
}

.detail {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  color: #2d364d;
  height: 50px;
  line-height: 25px;
  font-weight: 400;
  cursor: pointer;
}

.statistics {
  padding-top: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #2d364d;
  font-weight: 400;

  .file_icon {
    fill: #2f5ded;
    width: 20px;
    margin-right: 4px;
    vertical-align: sub;
  }
}
</style>
