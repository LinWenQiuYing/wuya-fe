<template>
  <div :class="$style._">
    <img src="@/assets/image/404.png" alt="" />
    <p :class="$style.tips">访问的页面不存在</p>
    <el-button-group>
      <el-button type="primary" @click="goHome">返回首页</el-button>
      <el-button type="primary" @click="goBack">返回上一页</el-button>
    </el-button-group>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goBack = () => router.go(-1);

const goHome = async () => {
  const home = router.currentRoute.value.path.startsWith("/admin") ? "/admin" : "/";
  await router.replace(home);
};
</script>

<style lang="scss" module>
._ {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tips {
  font-size: 20px;
  line-height: 1.4;
  font-weight: 400;
  margin: 30px 0 10px;
}
</style>
