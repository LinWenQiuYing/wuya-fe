<template>
  <div style="padding: 20px; height: 100%">
    <div class="create_box">
      <h2 class="title">{{ knowProcedure[active].title }}</h2>
      <el-steps :active="active" align-center class="steps_wrapper">
        <el-step
          v-for="(item, index) in knowProcedure"
          :class="index === active - 1 && 'blue_color'"
          :key="index"
          :icon="index <= active ? h('p', { class: ['dot', 'current_dot'] }) : h('div', { class: 'dot' })"
          :title="item.title"
        />
      </el-steps>
      <div class="create_content">
        <component
          :is="knowProcedure[active].content"
          ref="formRef"
          :currentProjectId="currentProjectId"
          class="coms"
        ></component>
      </div>
    </div>
    <div class="create_btn">
      <div class="btn_box">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="go">上一步</el-button>
        <el-button :loading="loading" type="primary" @click="save"
          >{{ active + 1 === knowProcedure.length ? "完成" : "下一步" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { create, createDatabase, createKnow, dataConnection, stopFileUpload } from "@/admin/api/knowledge";
import {
  AcountParams,
  CreateDataParams,
  CreateKnowledgeBaseParams,
  DateBseConnetionParams,
  KerberosParams,
} from "@/admin/types";
import { ElMessage } from "element-plus";
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import { createKnowProcedure } from "./const";
import { setKnowAuth } from "@/admin/api/auth";

const active = ref(0);
const formRef = ref();
const loading = ref<boolean>(false);

const router = useRouter();
const currentKnow = computed(() => store.state.knowledge.currentData);
const createType = computed(() => store.state.knowledge.createType);
const knowProcedure = computed(() => createKnowProcedure(createType.value));
const taskId = computed<string>(() => store.state.knowledge.taskId);

const currentProjectId = ref("");

const go = async () => {
  if (active.value - 1 < 0) {
    cancel();
  } else {
    if (active.value === 2) {
      await stopFileUpload(taskId.value);
    }
    active.value = active.value - 1;
  }
};

const cancel = () => {
  store.commit("knowledge/SET_CURRENT_DATA", null);
  store.commit("knowledge/SET_TASK_ID", "");
  router.push("/admin/knowledge");
};

const save = async () => {
  const fnGraphArr = [saveBaseInfo, graphFnOrDocFn, saveAuthsAndCreate];
  const fnTextArr = [saveBaseInfo, graphFnOrDocFn, sectionFn, saveAuthsAndCreate];
  const fnArr = createType.value === 1 ? fnTextArr : fnGraphArr;

  fnArr[active.value]();
};

const saveBaseInfo = async () => {
  const formValue = await formRef.value.form.validate().catch(console.log);
  if (!formValue) return;
  const formData = formRef.value.formData;
  const values: CreateKnowledgeBaseParams = {
    description: formData.description,
    name: formData.name,
    repositoryType: formData.repositoryType,
    sdbConfigureType: 1,
  };
  if (formData.repositoryType === 2) {
    values.graphEnName = formData.graphEnName;
    values.tagGroupId = formData.tagGroupId;
  }
  loading.value = true;
  const res: any = await create(values).catch(console.log);
  loading.value = false;
  if (!res) {
    return;
  }
  store.commit("knowledge/SET_CURRENT_DATA", res.data);
  currentProjectId.value = res.data.graphId;
  if (res.code === 200) {
    active.value = active.value + 1;
  }
};

const saveAuthsAndCreate = async () => {
  try {
    const auths = formRef.value.tableData();
    if (auths.length) await setKnowAuth(currentKnow.value.id, auths);
    loading.value = true;
    if (createType.value === 1) {
      const createRes = await createKnow({
        uploadTaskId: taskId.value,
      }).catch(console.log);
      loading.value = false;
      if (!createRes) return;
    }
    router.push("/admin/knowledge");
  } catch (e) {
    loading.value = false;
  }
};

const graphFnOrDocFn = () => {
  loading.value = true;
  if (createType.value === 1) {
    if (formRef.value.importData.addmode === "uploadFile") {
      if (!formRef.value.isUploaded) {
        ElMessage({
          type: "error",
          message: "请上传文件并等待上传完成后进行下一步",
        });
        loading.value = false;
        return;
      }
    } else {
      DocFn();
    }
  }
  loading.value = false;
  active.value = active.value + 1;
};

const DocFn = async () => {
  await formRef.value.form.validate();
  const authType =
    formRef.value.importData.connectionType === "FTP" ? "PASSWORD" : formRef.value.importData.authType;
  let paramsObj: {
    authInfos?: AcountParams | KerberosParams;
    connectionArgs?: {
      HDFS_SITE: string;
      CORE_SITE: string;
    };
  };
  if (formRef.value.importData.connectionType === "FTP") {
    paramsObj = {
      authInfos: {
        PASSWORD: formRef.value.importData.PASSWORD,
        USERNAME: formRef.value.importData.USERNAME,
      },
    };
  } else {
    paramsObj = {
      connectionArgs: {
        HDFS_SITE: formRef.value.importData.hdfs,
        CORE_SITE: formRef.value.importData.core,
      },
      authInfos: {},
    };
    if (formRef.value.importData.authType === "Kerberos") {
      paramsObj.authInfos = {
        PRINCIPAL: formRef.value.importData.Principal,
        KEYTAB: formRef.value.importData.keytab,
      };
    }
  }
  const createConnectionParams: DateBseConnetionParams = {
    name: formRef.value.importData.name,
    connectionType: formRef.value.importData.connectionType,
    workspaceUuid: "1",
    connection: formRef.value.importData.connection,
    authType,
    logicDatabases: {
      type: "SCHEMA",
      catalogSchemas: [
        {
          catalog: null,
          databases: formRef.value.importData.path.map((p) => "/" + p),
        },
      ],
    },
    ...paramsObj,
  };

  const res = await dataConnection(createConnectionParams);
  const createDataParams: CreateDataParams = {
    repositoryId: currentKnow.value.id,
    sourceId: res.id,
  };

  if (formRef.value.importData.updateType === 2) {
    createDataParams.updateInterval = formRef.value.importData.updateInterval;
    createDataParams.updateInterval = formRef.value.importData.updateType;
  }

  await createDatabase(createDataParams);
};

const sectionFn = () => {
  if (!formRef.value.isParser()) {
    ElMessage({
      type: "error",
      message: "请等待文件解析完成",
    });
    return;
  }
  active.value = active.value + 1;
};
</script>

<style lang="scss" scoped>
@import "src/styles/theme";

.create_box {
  height: calc(100% - 32px);
  background-color: #fff;
  padding: 19px $padding-xl;
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  .title {
    line-height: 32px;
    font-weight: 700;
    font-size: $font-size-xl;
    margin-bottom: 48px;
  }

  .steps_wrapper {
    max-width: 1064px;
    width: 100%;
    margin: 0 auto;
    --el-text-color-placeholder: #6d7587;

    :deep(.el-step__icon.is-icon) {
      width: 12px;
    }

    :deep(.el-step__line) {
      top: 8px;
      background-color: #f0f3fa;
    }

    :deep(.el-step__title) {
      line-height: 1;
      margin-top: -5px;
    }
  }

  :deep(.blue_color .el-step__line-inner) {
    border-width: 1px !important;
    width: 100% !important;
  }

  .create_content {
    flex: 1;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .coms {
      flex: 1;
      height: calc(100% - 48px);
      max-width: 884px;
      width: 100%;
      margin: 48px auto 0;
    }
  }
}

.create_btn {
  height: 32px;
  position: relative;
  background-color: #fff;

  .btn_box {
    position: absolute;
    right: 24px;
    bottom: 19px;
  }
}

.dot {
  width: 8px;
  height: 8px;
  margin: 5px auto;
  border-radius: 50%;
  background-color: #d6dae6;
}

.current_dot {
  background-color: #086df4;
}
</style>
