<template>
  <div class="homepage">
    <div class="homepage_background">
      <img class="homepage_background_img" :src="homepage_background" />
    </div>
    <div class="homepage_top">
      <h2 class="title"><span class="product">无涯</span>管理员端</h2>
      <div class="description">
        支持知识库管理、应用商店、组织管理和用户权限配置，提供文档的批量上传和切片服务，实现高效的知识共享与资源配置。
      </div>
    </div>
    <div class="homepage_content">
      <CardList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import homepage_background from "@/admin/assets/image/homepage_background.png";
import CardList from "./CardList.vue";
</script>

<style scoped>
.homepage {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(-87deg, #dde5ed 0%, #f0f3fa 99%);

  .homepage_background {
    display: flex;
    height: 40%;
    width: 100%;

    .homepage_background_img {
      flex: 1;
      width: 100%;
      height: auto;
    }
  }

  .homepage_top {
    padding: 16px 24px;
    position: absolute;
    top: 15%;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    justify-content: center;
  }

  .title {
    height: 50px;
    font-size: 34px;
    font-weight: 500;
    line-height: 50px;
    margin: 0;
  }

  .product {
    background: linear-gradient(-40deg, #1776ff, #6ac9ff);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .description {
    font-size: 14px;
    color: #6d7587;
    line-height: 26px;
  }

  .homepage_content {
    margin-top: -70px;
    padding: 16px 24px;
    height: calc(60% + 70px);
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    border-radius: 2px 0 0 2px;
  }
}
</style>
