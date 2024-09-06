<template>
  <div :class="styles.appStore">
    <div :class="styles.box">
      <!--      <div class="title">应用商店</div>-->
      <!-- <div class="search">
        <el-input v-model="searchValue" clearable  @change="searchFn" size="large" placeholder="请输入搜索内容" :suffix-icon="Search" />
      </div> -->
      <div :class="styles.installed_card">
        <div :class="styles.installed_card_title">已安装</div>
        <div :class="styles.installed_card_content">
          <Card v-for="(item, index) in cardList1" :key="index" style="margin-bottom: 10px" :data="item" />
        </div>
      </div>
      <div :class="styles.recommend_card">
        <el-tabs v-model="activeName" :class="styles.appstore_tab">
          <el-tab-pane v-for="(name, index) in tabsName" :key="name" :name="name">
            <template #label>
              <div style="font-weight: 700">{{ name }}</div>
            </template>
            <div :class="styles.recommend_card_cardList">
              <Card
                v-for="(item, index) in cardList2"
                :key="index"
                style="margin-bottom: 10px"
                :data="item"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useCssModule } from "vue";
import Card from "./component/Card.vue";
import staffTrainPng from "@/admin/assets/image/staff_train.png";
import { CardState } from "@/admin/types/appStore";

const styles = useCssModule("appstore");
const activeName = ref("全部");
const tabsName = ref(["全部", "通用", "金融", "能源", "工业", "医疗", "交通", "特定行业"]);
const cardList1 = ref<CardState[]>([]);
const cardList2 = ref<CardState[]>([]);

onMounted(() => {
  cardList1.value = [
    {
      IconImg: staffTrainPng,
      title: "智能问答",
      content: "提供即时、准确的问题解答，助力快速获取所需信息，提高工…",
      count: 1255,
    },
    {
      IconImg: staffTrainPng,
      title: "文档问答",
      content: "针对大量文档内容，提供快速、精准的信息检索和问答服务，…",
      count: 578,
    },
    {
      IconImg: staffTrainPng,
      title: "智能写作",
      content: "利用人工智能技术，快速生成高质量文本，提升写作效率和内…",
      count: 482,
    },
    {
      IconImg: staffTrainPng,
      title: "实时资讯",
      content: "提供最新的市场动态和行业资讯，帮助用户及时了解并应对…",
      count: 87,
    },
  ];

  cardList2.value = [
    {
      IconImg: staffTrainPng,
      title: "医疗分析",
      content: "结合最新的医疗数据和研究成果，为医疗决策和临床实践提…",
      count: 1255,
    },
    {
      IconImg: staffTrainPng,
      title: "投研",
      content: "集成市场数据分析和投资研究，为投资决策提供全面的数据支持",
      count: 578,
    },
    {
      IconImg: staffTrainPng,
      title: "军工",
      content: "集合国防和军事领域的深入分析，为相关决策和发展提供专…",
      count: 482,
    },
    {
      IconImg: staffTrainPng,
      title: "建设施工",
      content: "提供建筑施工领域的全面数据分析和管理建议，优化工程规划…",
      count: 87,
    },
  ];
});
</script>

<style lang="scss" module="appstore">
@import "src/styles/theme";
@import "src/styles/mixins";

.appStore {
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .box {
    display: flex;
    flex-direction: column;
    margin: 0 160px;
    height: 100%;

    .title {
      height: 40px;
      font-size: 28px;
      color: #2d364d;
      font-weight: 700;
      text-align: center;
    }

    .search {
      height: 60px;
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }

    .installed_card {
      width: 100%;

      .installed_card_title {
        height: 30px;
        margin: 40px 0 4px;
        font-size: 18px;
        color: #2d364d;
        line-height: 32px;
        font-weight: 700;
      }

      .installed_card_content {
        height: 220px;
        display: flex;
        justify-content: space-around;
      }
    }

    .recommend_card {
      width: 100%;
      height: 250px;

      .recommend_card_cardList {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        margin-top: 15px;
      }
    }
  }
}

.appstore_tab {
  :global {
    @include margin-color();
  }
}
</style>
