<template>
  <div :class="[$style._]">
    <header :class="$style.header">
      <h2>关于我们</h2>
    </header>
    <div :class="$style.main">
      <div :class="$style.title">简介</div>
      <div :class="$style.content">
        星环众志（星环众志科技（北京）有限公司）致力于打造企业级大数据和人工智能基础软件，围绕数据的集成、存储、治理、建模、分析、挖据和流通等数据全生命周期提供基础软件与服务，构建明日数据世界。<br />
        无涯Infinity，是一款基于星环大模型底座，结合个人知识库、企业知识库、法律法规、财经等多种知识源的企业级垂直领域问答产品。
      </div>
      <div :class="$style.title">联系我们</div>
      <div :class="$style.content">
        <div :class="$style.inlineSpan">
          <span>电话：</span>
          <a href="tel:010-68278990">010-68278990</a>
        </div>
        <div :class="$style.inlineSpan">
          <span>邮箱：</span>
          <a href="mailto:mkt@transwarp.io">mkt@transwarp.io</a>
        </div>
        <div :class="$style.inlineSpan">
          <span :class="$style.titleSpan">地址：</span>
          <span>北京市海淀区复兴路69号院11号五层-502、503、504、505、506、507、508</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  height: 52px;
  box-sizing: border-box;
  border-bottom: 2px solid #eee;

  h2 {
    font-size: 18px;
    color: theme.$text-color-primary;
    font-weight: 700;
  }
}
.inlineSpan {
  display: flex;
  a {
    font-size: 14px;
    color: theme.$text-color-primary;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }
}
.titleSpan {
  width: 42px;
  flex-shrink: 0;
}

.title {
  font-weight: bold;
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 32px;
  text-align: left;
  font-style: normal;
  max-width: 720px;
  margin: 32px auto 0;
}

.content {
  max-width: 720px;
  background: #f0f2f7;
  border-radius: 6px;
  opacity: 0.7;
  padding: 20px 24px;
  font-size: 14px;
  color: theme.$text-color-primary;
  line-height: 24px;
  text-align: left;
  font-style: normal;
  margin: 8px auto 0;
  display: flex;
  flex-direction: column;
}

.main {
  margin-top: -1px;
  flex: 1;
  overflow-y: auto;
  background: #fff;
  border-top-left-radius: 14px;
}

@media screen and (width <= 960px) {
  .header {
    margin: 0 15px;
    width: unset;
  }

  .main {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>
