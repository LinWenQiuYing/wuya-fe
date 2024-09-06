<template>
  <div>
    <el-form label-width="100px" require-asterisk-position="right" :model="importData" ref="form">
      <el-form-item
        label="添加方式"
        prop="addmode"
        :rules="[
          {
            required: true,
            message: '请选择添加方式',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="importData.addmode">
          <el-radio value="uploadFile">批量上传文件</el-radio>
          <!--          <el-radio value="datasource">配置数据源</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="importData.addmode === 'uploadFile'" label="选择文件" prop="file" required>
        <div class="upload-box">
          <el-upload
            style="width: 100%"
            :ref="`Uploader-${uploadId}`"
            :multiple="true"
            :file-list="fileList"
            :accept="acceptableExtensions"
            :on-change="handleChange"
            :auto-upload="false"
            :show-file-list="false"
            :name="uploadId"
          >
            <el-link :underline="false" style="margin-right: 10px" type="primary" @click="clearList()">
              <ImportIcon class="icon-import" /> &nbsp;导入
            </el-link>
            <div ref="uploadRef" style="opacity: 0" @click="uploadFiles"></div>
          </el-upload>
          <FileListCom v-if="fileList.length" :fileList="fileList" class="file-list-warp" />
        </div>
      </el-form-item>
      <template v-else>
        <el-form-item
          label="数据源名称"
          prop="name"
          :rules="[
            {
              required: true,
              message: '请输入数据源名称',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="importData.name" class="base_input" />
        </el-form-item>
        <el-form-item
          label="自动更新"
          prop="updateType"
          :rules="[
            {
              required: true,
              message: '请选择是否自动更新',
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="importData.updateType" class="base_input">
            <el-option label="启用" :value="2" />
            <el-option label="不启用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="importData.updateType === 2"
          label="同步间隔"
          prop="updateInterval"
          :rules="[
            {
              required: true,
              message: '请选择同步间隔天数',
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="importData.updateInterval" class="base_input">
            <el-option label="1天" :value="1" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="connectionType"
          :rules="[
            {
              required: true,
              message: '请选择类型',
              trigger: 'blur',
            },
          ]"
        >
          <el-radio-group v-model="importData.connectionType">
            <el-radio value="FTP">FTP</el-radio>
            <el-radio value="HDFS">HDFS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="importData.connectionType === 'HDFS'"
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
          <el-radio-group v-model="importData.connectionMode">
            <el-radio value="RPC">RPC</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="地址"
          prop="connection"
          :rules="[
            {
              required: true,
              message: '请输入地址',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="importData.connection" class="base_input" />
        </el-form-item>
        <el-form-item
          v-if="importData.connectionType === 'HDFS'"
          label="hdfs-site"
          prop="hdfs"
          :rules="[
            {
              required: true,
              message: '请选择hdfs-site.xml文件',
              trigger: 'blur',
            },
          ]"
        >
          <div style="display: flex">
            <el-upload
              accept=".xml"
              :auto-upload="false"
              :on-change="(file) => handleFile(file, 'hdfs-site.xml', 'hdfs')"
              :show-file-list="false"
            >
              <el-link type="primary" :underline="false" style="margin-right: 10px"
                ><Upload style="width: 16px" /> &nbsp;{{ fileName.hdfs }}</el-link
              >
            </el-upload>
            上传单个配置文件，文件名必须是hdfs-site.xml
          </div>
        </el-form-item>
        <el-form-item
          v-if="importData.connectionType === 'HDFS'"
          label="core-site"
          prop="core"
          :rules="[
            {
              required: true,
              message: '请选择core-site.xml文件',
              trigger: 'blur',
            },
          ]"
        >
          <div style="display: flex">
            <el-upload
              accept=".xml"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleFile(file, 'core-site.xml', 'core')"
            >
              <el-link type="primary" :underline="false" style="margin-right: 10px"
                ><Upload style="width: 16px" /> &nbsp;{{ fileName.core }}</el-link
              >
            </el-upload>
            上传单个配置文件，文件名必须是core-site.xml
          </div>
        </el-form-item>
        <el-form-item v-if="importData.connectionType === 'HDFS'" label="认证模式" prop="authType" required>
          <el-radio-group v-model="importData.authType">
            <el-radio value="NONE">None</el-radio>
            <el-radio value="KERBEROS">Kerberos</el-radio>
            <!-- <el-radio value="LDAP">LDAP</el-radio>
            <el-radio value="AccessToken">Access Token</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <div v-if="importData.connectionType === 'HDFS'">
          <el-form-item
            v-if="importData.authType === 'KERBEROS'"
            label="Principal"
            prop="Principal"
            :rules="[
              {
                required: true,
                message: '请输入',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="importData.Principal" class="base_input" />
          </el-form-item>
          <el-form-item
            v-if="importData.authType === 'KERBEROS'"
            label="Keytab"
            prop="keytab"
            :rules="[
              {
                required: true,
                message: '请选择.keytab后缀名文件',
                trigger: 'blur',
              },
            ]"
          >
            <div style="display: flex">
              <el-upload
                accept=".keytab"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(file) => handleFile(file, '.keytab', 'keytab')"
              >
                <el-link type="primary" :underline="false" style="margin-right: 10px"
                  ><Upload style="width: 16px" /> &nbsp;{{ fileName.keytab }}</el-link
                >
              </el-upload>
              上传单个配置文件，文件名后缀必须是.keytab
            </div>
          </el-form-item>
        </div>

        <div v-if="importData.connectionType === 'FTP'">
          <el-form-item
            label="用户名"
            prop="USERNAME"
            :rules="[
              {
                required: true,
                message: '请输入用户名',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="importData.USERNAME" class="base_input" />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="PASSWORD"
            :rules="[
              {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="importData.PASSWORD"
              class="base_input"
              :show-password="true"
              type="password"
            />
          </el-form-item>
        </div>
        <el-form-item label="">
          <div class="login_box">
            <el-link type="primary" class="link" :underline="false" @click="connection">连接</el-link>

            <div v-if="connectionState" class="connection-state">
              <CircleCheckIcon v-if="connectionState.state === 'success'" class="icon-resolved" />
              <CircleXMarkIcon v-else class="icon-rejected" />
              <span>{{ connectionState.str }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="文档目录"
          v-if="isConnect"
          prop="path"
          :rules="[
            {
              required: true,
              message: '请选择目录',
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="importData.path" class="base_input" multiple placeholder="请选择目录">
            <el-option v-for="(str, i) in pathData" :key="i" :label="str" :value="str" />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { Edit, Upload } from "@element-plus/icons-vue";
import FileListCom from "./FileList.vue";
import { dataBaseConnection, stopFileUpload, uploadLocalFiles } from "@/admin/api/knowledge";
import store from "@/store";
import { UploadFile, UploadRawFile, ElMessage } from "element-plus";
import { batchProgress } from "@/api/knowledgeRequst";
import CircleCheckIcon from "@/admin/icons/circle-check.svg";
import CircleXMarkIcon from "@/admin/icons/circle-xmark.svg";
import { UploadFileParams } from "@/client/types/api";
import ImportIcon from "@/admin/icons/square-left-bottom-arrow.svg";
import { acceptableExtensions } from "@/store/upload";

const importData = reactive({
  addmode: "uploadFile",
  file: "",
  name: "",
  updateType: 1,
  connectionType: "FTP",
  USERNAME: "",
  connectionMode: "RPC",
  connection: "",
  PASSWORD: "",
  authType: "NONE",
  Principal: "",
  updateInterval: 1,
  hdfs: "",
  core: "",
  keytab: "",
  path: [],
});

const fileList = ref<Array<UploadFile | UploadFileParams>>([]);
const fileName = reactive({
  hdfs: "上传文件",
  core: "上传文件",
  keytab: "上传文件",
});
const connectionState = ref();
const form = ref();

const isConnect = ref<boolean>(false);
const pathData = ref<string[]>();
const isUploaded = ref<boolean>(false);
const currentData = computed(() => store.state.knowledge.currentData);
const uploadId = ref(Math.random().toString(36).substr(2).toLocaleUpperCase());
const taskId = computed(() => store.state.knowledge.taskId);

const uploadRef = ref();
const handleChange = (file: UploadFile, list: UploadFile[]) => {
  file.status == "ready" && fileList.value.push(file);
  //获取原始文件的个数
  const fileTotal = (document.getElementsByName(uploadId.value)[0] as any).files.length;
  if (fileList.value.length === fileTotal) {
    uploadRef.value.click();
  }
};

const uploadFiles = async () => {
  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append("files", file.raw as UploadRawFile);
  });
  formData.append("id", currentData.value.id);
  const res = await uploadLocalFiles(formData);
  getBatchProgress(res.data);
  store.commit("knowledge/SET_TASK_ID", res.data);
};

const connection = async () => {
  try {
    const params = {
      name: importData.name,
      connectionType: importData.connectionType,
      workspaceUuid: "1",
      authInfos: {
        PASSWORD: importData.PASSWORD,
        USERNAME: importData.USERNAME,
      },
      connection: importData.connection,
      authType: "PASSWORD",
    };
    const res = await dataBaseConnection(params);
    connectionState.value = {
      state: "success",
      str: "连接成功",
    };
    pathData.value = res.catalogSchemaWithMessagesList[0].databases;
    isConnect.value = true;
  } catch (error) {
    connectionState.value = {
      state: "fail",
      str: "连接失败，请重试",
    };
  }
};

const getBatchProgress = async (taskId: string) => {
  const res = await batchProgress(taskId);
  fileList.value = res.data.documents.map((file) => ({
    ...file,
    status: res.data.uploadTaskStatus < 3 ? "ready" : res.data.uploadTaskStatus === 4 ? "success" : "fail",
  }));

  const isUploadFail = res.data.documents.some((d) => d.fileStatus === 3);
  if (isUploadFail) return;
  if (res.data.uploadTaskStatus < 3) {
    setTimeout(() => {
      getBatchProgress(taskId);
    }, 3000);
  } else {
    if (res.data.documents.every((d) => d.fileStatus === 4)) {
      store.commit("knowledge/SET_UPLOAD_FILES", res.data.documents);
      isUploaded.value = true;
    }
  }
};

const clearList = async () => {
  isUploaded.value = false;
  if (fileList.value.length) fileList.value = [];
  if (taskId.value) {
    await stopFileUpload(taskId.value);
  }
};

const handleFile = (file: UploadFile, name: string, key: "hdfs" | "core" | "keytab") => {
  if (key !== "keytab" && file.name !== name) {
    ElMessage({
      type: "error",
      message: `请上传${name}文件`,
    });
    return false;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    if (e.target?.result) {
      if (key === "keytab") {
        importData[key] = (e.target.result as string).split(",")[1];
      } else {
        importData[key] = e.target.result as string;
      }
    }
  };
  key === "keytab" ? reader.readAsDataURL(file.raw!) : reader.readAsText(file.raw!);
  fileName[key] = file.name;
  return Promise.resolve();
};
defineExpose({
  isUploaded,
  form,
  importData,
});
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.base_input {
  max-width: 432px;
  border-radius: $border-radius-md;
}

.login_box {
  display: flex;
  width: 100%;
  justify-content: left;
  .link {
    margin: 0 10px;
  }
  .connection-state {
    min-width: 72px;
    line-height: 36px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.icon-resolved {
  fill: $green_color;
}

.icon-rejected {
  fill: #ea3a44;
}

.icon-import {
  width: 16px;
  fill: currentColor;
}

.upload-box {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.file-list-warp {
  max-height: 40vh;
  overflow: auto;
}
</style>

<style scoped>
:deep(.base_input .el-input__inner) {
  border-radius: 0;
}
</style>
