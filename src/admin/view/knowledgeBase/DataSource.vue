<template>
  <div class="list-header">
    <div class="header-left">
      <el-button type="primary" @click="dialogVisible = true"> 新建数据源 </el-button>
    </div>
    <div class="header-right">
      <el-input v-model="search" class="input" placeholder="请输入关键词" :suffix-icon="Search" />
    </div>
  </div>
  <div class="list-content">
    <el-table :data="tableData" border size="large" style="width: 100%">
      <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="地址" prop="location"></el-table-column>
      <el-table-column label="自动更新" prop="update"></el-table-column>
      <el-table-column label="更新频率" prop="rate"></el-table-column>
      <el-table-column label="创建时间" prop="time"></el-table-column>
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

  <el-dialog
    v-model="dialogVisible"
    title="新建数据源"
    width="480px"
    style="max-height: 600px; overflow-y: auto"
  >
    <el-form label-position="top" require-asterisk-position="right" :model="dataSource">
      <el-form-item
        label="数据源名称"
        prop="datasourceName"
        :rules="[
          {
            required: true,
            message: '请输入数据源名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="dataSource.datasourceName" class="input" />
      </el-form-item>
      <el-form-item
        label="自动更新"
        prop="autorefresh"
        :rules="[
          {
            required: true,
            message: '请选择是否自动更新',
            trigger: 'blur',
          },
        ]"
      >
        <el-select v-model="dataSource.autorefresh" class="input" style="width: 100%">
          <el-option label="启用" :value="true" />
          <el-option label="不启用" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
        :rules="[
          {
            required: true,
            message: '请选择类型',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="dataSource.type">
          <el-radio label="FTP">FTP</el-radio>
          <el-radio label="HDFS">HDFS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataSource.type === 'HDFS'"
        label="连接模式"
        prop="connectionMode"
        :rules="[
          {
            required: true,
            message: '请选择连接模式',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="dataSource.connectionMode">
          <el-radio label="RPC">RPC</el-radio>
          <el-radio label="WEBHDFS">WEB HDFS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="location"
        :rules="[
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="dataSource.location" class="input" />
      </el-form-item>
      <el-form-item
        v-if="dataSource.connectionMode === 'RPC' && dataSource.type === 'HDFS'"
        label="hdfs-site"
        prop="hdfsSite"
        required
      >
        <div style="display: flex">
          <el-upload>
            <el-link type="primary" :underline="false" style="margin-right: 10px"
              ><Upload style="width: 16px" /> &nbsp;上传文件</el-link
            >
          </el-upload>
          上传单个配置文件，文件名必须是hdfs-site.xml
        </div>
      </el-form-item>
      <el-form-item
        v-if="dataSource.connectionMode === 'RPC' && dataSource.type === 'HDFS'"
        label="core-site"
        prop="coreSite"
        required
      >
        <div style="display: flex">
          <el-upload>
            <el-link type="primary" :underline="false" style="margin-right: 10px"
              ><Upload style="width: 16px" /> &nbsp;上传文件</el-link
            >
          </el-upload>
          上传单个配置文件，文件名必须是core-site.xml
        </div>
      </el-form-item>
      <el-form-item v-if="dataSource.type === 'HDFS'" label="认证模式" prop="authenticationMode" required>
        <el-radio-group v-model="dataSource.authenticationMode">
          <el-radio label="none">None</el-radio>
          <el-radio label="Kerberos">Kerberos</el-radio>
          <el-radio label="LDAP">LDAP</el-radio>
          <el-radio label="AccessToken">Access Token</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="dataSource.type === 'FTP'">
        <el-form-item
          label="用户名"
          prop="userName"
          :rules="[
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="dataSource.userName" class="input" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
          ]"
        >
          <div class="login_box">
            <el-input v-model="dataSource.password" class="input" :show-password="true" type="password" />
            <el-link type="primary" class="link" :underline="false">连接</el-link>
          </div>
        </el-form-item>
      </div>
      <Explain v-if="dataSource.type === 'HDFS'" />
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search, Upload } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import Explain from "./components/Explain.vue";

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
    type: "Hippo",
    location: "168.2.255.255",
    update: "增量更新",
    rate: "每天",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 2,
    name: "星环科技2023年年度报告.pdf",
    type: "Hippo",
    location: "168.2.255.255",
    update: "增量更新",
    rate: "每天",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 3,
    name: "星环科技2023年年度报告.pdf",
    type: "Hippo",
    location: "168.2.255.255",
    update: "增量更新",
    rate: "每天",
    time: "2023-12-12 12:00:00",
  },
  {
    id: 4,
    name: "星环科技2023年年度报告.pdf",
    type: "Hippo",
    location: "168.2.255.255",
    update: "增量更新",
    rate: "每天",
    time: "2023-12-12 12:00:00",
  },
]);

const dataSource = reactive({
  datasourceName: "",
  autorefresh: false,
  type: "FTP",
  userName: "",
  authenticationMode: "none",
  location: "",
  password: "",
  connectionMode: "RPC",
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
