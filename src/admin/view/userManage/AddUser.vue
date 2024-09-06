<template>
  <div class="edit_container">
    <el-breadcrumb separator="/" style="height: 20px">
      <el-breadcrumb-item>
        <span>用户管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="current_text">{{ title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title" style="padding: 20px 0 0 20px">
      <h2>
        <UserAddIcon v-if="flag" class="user_icon" />
        <UserEditIcon v-else class="user_icon" />
        {{ title }}
      </h2>
    </div>
    <div class="edit_msg">
      <el-form
        class="form-box"
        ref="formRef"
        style="max-width: 500px"
        :model="data"
        label-width="100px"
        require-asterisk-position="right"
      >
        <el-form-item
          prop="username"
          label="账号"
          :rules="[
            {
              required: true,
              message: '请输入账号',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="data.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          prop="nickname"
          label="姓名"
          :rules="[
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="data.nickname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          v-if="flag"
          prop="password"
          label="登录密码"
          :rules="[
            {
              required: true,
              message: '请输入登录密码',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="data.password"
            placeholder="请输入"
            :show-password="true"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="data.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="data.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="!flag" prop="enable" label="用户状态">
          <el-switch
            v-model="data.enable"
            inline-prompt
            active-text="开"
            inactive-text="关"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </el-form-item>
        <h2 class="title" style="margin-top: 20px; margin-bottom: 16px">机构设置</h2>
        <el-form-item
          :rules="[
            {
              required: true,
              message: '请选择机构',
              trigger: 'blur',
            },
          ]"
          label="机构"
          prop="organId"
        >
          <div class="treeSelectCom">
            <WTreeSelect :organ-id="data.organId" @send-current-org-id="getCurrentOrgId" />
          </div>
        </el-form-item>
        <h2 class="title" style="margin: 20px 0 16px">角色设置</h2>
        <div class="set_role">
          <div>角色（{{ (data.roleIds && data.roleIds.length) || 0 }}）</div>
          <div class="set_role_select">
            <el-checkbox-group v-model="data.roleIds">
              <el-checkbox v-for="role in roles" :key="role.id" :label="role.id" border>{{
                role.description
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form>
    </div>
    <div class="roleBtn">
      <el-button @click="cancelForm"> 取消 </el-button>
      <el-button type="primary" @click="submitForm(formRef)"> 确定 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import WTreeSelect from "./component/WTreeSelect.vue";
import { getRolesList, addUser, editUser, getUserDetail } from "@/admin/api/userManage";
import UserAddIcon from "@/admin/icons/user-plus.svg";
import UserEditIcon from "@/admin/icons/user-pen.svg";
import { ElMessage, ElForm } from "element-plus";
import { Show_state } from "@/admin/types";
import { UserRecord } from "@/admin/types/api";

const props = defineProps<{
  editData: UserRecord;
}>();
// 标识是编辑还是添加
const flag = ref(true);
const title = computed(() => (flag.value ? "添加用户" : "编辑用户"));

const formRef = ref<InstanceType<typeof ElForm>>();
const data = ref({
  username: "",
  nickname: "",
  password: "",
  phone: "",
  email: "",
  enable: false,
  organId: "",
  roleIds: [],
});

const roles = ref([]);
const emit = defineEmits(["sendChangeState"]);

const submitForm = async (formEl: InstanceType<typeof ElForm>) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        email: data.value.email || null,
        organId: data.value.organId,
        password: data.value.password,
        nickname: data.value.nickname,
        roleIds: data.value.roleIds,
        phone: data.value.phone || null,
        username: data.value.username,
      };
      if (flag.value) {
        addUser(params).then((res) => {
          ElMessage.success("添加成功");
          cancelForm();
        });
      } else {
        editUser({ ...params, id: props.editData.id, enable: data.value.enable }).then((res) => {
          ElMessage.success("修改成功");
          cancelForm();
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const cancelForm = () => {
  emit("sendChangeState", {
    status: Show_state.CHECK,
  });
};

// 获取角色设置信息
const getRolesListFn = async () => {
  const res = await getRolesList();
  roles.value = res.data;
};
// 获取机构id
const getCurrentOrgId = (id) => {
  data.value.organId = id;
};
onMounted(() => {
  getRolesListFn();
});
watch(
  () => props.editData,
  () => {
    if (props.editData && Object.keys(props.editData).length > 0) {
      flag.value = !flag.value;
      data.value = {
        ...data.value,
        ...props.editData,
      };

      getUserDetail(props.editData.id).then((res) => {
        data.value.roleIds = res.data.roles.map((role) => role.id);
      });
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@import "../../../styles/theme";

.edit_container {
  padding: 20px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;

  .current_text {
    font-weight: 700;
    color: black;
  }

  .title {
    display: flex;
    align-items: center;
    background-color: #fff;

    h2 {
      height: 22px;
      font-weight: 700;
      margin: 8px 0 0 3px;
      line-height: 22px;
      font-size: 18px;
    }
  }
  .edit_msg {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
    background-color: #fff;

    .title {
      font-size: 16px;
      color: #2d364d;
      line-height: 24px;
      font-weight: 700;
    }

    .set_role {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      background: #f0f3fa;
      box-shadow: 0px 1px 0px 0px rgba(240, 243, 250, 1);
      &_select {
        margin-top: 8px;
        display: flex;
      }
    }
  }

  .roleBtn {
    display: flex;
    background: #fff;
    justify-content: right;
    padding: 0 10px 10px 0;
  }
}

.user_icon {
  width: 20px;
  vertical-align: text-bottom;
}

.treeSelectCom {
  height: 100%;
  width: 100%;
}
</style>

<style scoped>
:deep(.edit_msg .el-input) {
  border-radius: 0;
  box-shadow: none;
}

:deep(.edit_msg .el-input__inner) {
  border-radius: 0;
}

:deep(.el-checkbox) {
  width: 200px;
  height: 60px;
  margin-bottom: 8px;
}
</style>
