<template>
  <div class="list-header">
    <div class="header-left">
      <el-button type="primary" @click="dialogVisible = true"> 新建模板 </el-button>
    </div>
    <div class="header-right">
      <el-input v-model="search" class="input" placeholder="请输入关键词" :suffix-icon="Search" />
    </div>
  </div>
  <div class="list-content">
    <el-table :data="tableData" border size="large" style="width: 100%">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
      <el-table-column label="修改时间" prop="time"></el-table-column>
      <el-table-column prop="operation" label="操作">
        <template #default>
          <el-link type="primary" :underline="false">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagintion"
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :total="tableData.length - 1"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>

  <el-dialog v-model="dialogVisible" title="新建模板" width="480px">
    <el-form require-asterisk-position="right" label-width="auto" :model="dataSource">
      <el-form-item
        label="模板名称"
        prop="templateName"
        :rules="[
          {
            required: true,
            message: '请输入数据源名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="dataSource.templateName" class="input" />
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input v-model="dataSource.content" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";

const search = ref<string>();
const dialogVisible = ref<boolean>(false);
const currentPage = ref<number>(0);
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const tableData = ref([
  {
    id: 1,
    name: "星环科技2023年年度报告.pdf",
    content: "你是一位金融分析师，请对【银行】的财务报表进行",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 2,
    name: "星环科技2023年年度报告.pdf",
    content: "你是一位金融分析师，请对【银行】的财务报表进行",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 3,
    name: "星环科技2023年年度报告.pdf",
    content: "你是一位金融分析师，请对【银行】的财务报表进行",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 4,
    name: "星环科技2023年年度报告.pdf",
    content: "你是一位金融分析师，请对【银行】的财务报表进行",
    time: "2023-12-12 12:00:00",
  },
]);

const dataSource = reactive({
  templateName: "",
  content: "",
});
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.list-header {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}

.list-content {
  max-height: 100%;
  position: relative;

  .pagintion {
    position: absolute;
    bottom: -40px;
    right: 0;
  }
}
.login_box {
  display: flex;
  width: 100%;
  .link {
    width: 50px;
    margin-left: 10px;
  }
}
</style>

<style scoped>
:deep(.input .el-input__inner) {
  border-radius: 0;
}
</style>
