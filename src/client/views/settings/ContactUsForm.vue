<template>
  <el-form ref="formRef" :rules="formRules" :model="form" :class="$style._" @keydown.enter="onSubmit">
    <el-form-item prop="username">
      <el-input v-model="form.username" autofocus placeholder="姓名(必填)" maxlength="64" clearable />
    </el-form-item>
    <el-form-item prop="phone">
      <el-input v-model="form.phone" placeholder="手机号(必填)" maxlength="11" clearable />
    </el-form-item>
    <el-form-item prop="verifyCode">
      <PhoneVerifier
        v-model="form.verifyCode"
        :phone="form.phone"
        bar-type="split"
        placeholder="验证码(必填)"
      />
    </el-form-item>
    <el-form-item label="贵司的身份:" prop="identityClassification">
      <el-radio-group v-model="form.identityClassification">
        <el-radio value="终端用户">终端用户</el-radio>
        <el-radio value="中间商">中间商</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否已有采购需求:" prop="purposeful">
      <el-radio-group v-model="form.purposeful">
        <el-radio value="是">是</el-radio>
        <el-radio value="否">否</el-radio>
        <el-radio value="不确定">不确定</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="form.email" placeholder="邮箱(必填)" />
    </el-form-item>
    <el-form-item prop="company">
      <el-input v-model="form.company" placeholder="公司(必填)" />
    </el-form-item>
    <el-form-item prop="province">
      <el-select v-model="form.province" placeholder="省份(必填)">
        <el-option
          v-for="province in provinceDict"
          :key="province.value"
          :value="province.value"
          :label="province.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="industry">
      <el-select v-model="form.industry" placeholder="行业(必填)">
        <el-option
          v-for="industry in industryDict"
          :key="industry.value"
          :value="industry.value"
          :label="industry.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="position">
      <el-select v-model="form.position" placeholder="职务(必填)">
        <el-option
          v-for="position in positionDict"
          :key="position.value"
          :value="position.value"
          :label="position.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="requirement">
      <el-input v-model="form.requirement" type="textarea" :rows="3" placeholder="需求(必填)" />
    </el-form-item>
    <el-form-item :class="$style.termsItem" prop="agreed">
      <TermsCheckbox
        v-model:checked="form.agreed"
        v-model:tip="tipAgreeTerms"
        :link-class="$style.link"
        predicate="阅读并接受"
      />
    </el-form-item>
    <el-button
      type="primary"
      :class="$style.submit"
      :loading-icon="Loading"
      :loading="submitting"
      @click="onSubmit"
    >
      提交
    </el-button>
  </el-form>
</template>
<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { contactUs } from "@/client/api/user";
import PhoneVerifier from "@/sign/components/PhoneVerifier.vue";
import useProvinceDict from "@/store/hooks/useProvinceDict";
import useIndustryDict from "@/store/hooks/useIndustryDict";
import usePositionDict from "@/store/hooks/usePositionDict";
import getRequiredValidator from "@/sign/validators/getRequiredValidator";
import getPhoneValidator from "@/sign/validators/getPhoneValidator";
import getEmailValidator from "@/sign/validators/getEmailValidator";
import TermsCheckbox from "@/sign/components/TermsCheckbox.vue";

const emit = defineEmits<{
  next: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref<boolean>(false);
const tipAgreeTerms = ref(false);

const provinceDict = useProvinceDict();
const industryDict = useIndustryDict();
const positionDict = usePositionDict();

type PasswordEditFormData = {
  username: string;
  phone: string;
  verifyCode: string;
  identityClassification: "终端用户" | "中间商";
  purposeful: "是" | "否" | "不确定";
  email: string;
  company: string;
  province: string;
  industry: string;
  position: string;
  requirement: string;
  agreed?: boolean;
};

const form = reactive<PasswordEditFormData>({
  username: "",
  phone: "",
  verifyCode: "",
  identityClassification: "终端用户",
  purposeful: "是",
  email: "",
  company: "",
  province: "",
  industry: "",
  position: "",
  requirement: "",
});

const formRules = reactive<FormRules<PasswordEditFormData>>({
  username: [{ validator: getRequiredValidator("姓名不能为空"), trigger: "blur" }],
  phone: [
    { validator: getRequiredValidator("手机号不能为空"), trigger: "blur" },
    { validator: getPhoneValidator("手机号不合法"), trigger: "blur" },
  ],
  verifyCode: [{ validator: getRequiredValidator("验证码不能为空"), trigger: "change" }],
  identityClassification: [{ validator: getRequiredValidator("身份不能为空"), trigger: "change" }],
  purposeful: [{ validator: getRequiredValidator("是否已有采购需求不能为空"), trigger: "change" }],
  email: [
    { validator: getRequiredValidator("邮箱不能为空"), trigger: "blur" },
    { validator: getEmailValidator("邮箱不合法"), trigger: "blur" },
  ],
  company: [{ validator: getRequiredValidator("公司不能为空"), trigger: "blur" }],
  province: [{ validator: getRequiredValidator("省份不能为空"), trigger: "change" }],
  industry: [{ validator: getRequiredValidator("行业不能为空"), trigger: "change" }],
  position: [{ validator: getRequiredValidator("职位不能为空"), trigger: "change" }],
  requirement: [{ validator: getRequiredValidator("请填写你的需求"), trigger: "blur" }],
  agreed: [{ validator: getRequiredValidator("请阅读并接受相应条款"), trigger: "change" }],
});

const onSubmit = async () => {
  const formInstance = formRef.value;
  if (!formInstance) {
    console.warn("找不到form实例");
    return;
  }
  const valid = await formInstance.validate().catch(console.log);
  if (!valid) {
    console.warn("表单未通过校验");
    return;
  }
  submitting.value = true;
  const payload = {
    // 省份
    area: form.province,
    // 需求
    attr22: form.requirement,
    // 手机验证码
    code: form.verifyCode,
    // 公司
    company: form.company,
    // 邮箱
    email: form.email,
    // 是否已有采购需求
    hasPurchaseRequirement: form.purposeful,
    // 贵司的身份
    identity: form.identityClassification,
    // 行业
    industry: form.industry,
    // 手机号
    mobile: form.phone,
    // 姓名
    name: form.username,
    // 终端用户公司名称
    terminalCompany: form.company,
    // 职务
    title: form.position,
    // 当前页面地址
    url: location.href,
  };
  const submitted = await contactUs(payload).catch((msg: string) => {
    ElMessage.error(msg);
  });
  submitting.value = false;
  if (!submitted) return;
  ElMessage.success("表单提交成功! 我们会尽快联系您.");
  emit("next");
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  padding: 20px;
  --el-font-size-base: 16px;
  --el-text-color-regular: theme.$text-color-primary;

  :global {
    .el-input {
      --el-input-height: 38px;
      --el-input-text-color: theme.$text-color-primary;
      font-size: 16px;

      ::placeholder {
        color: #6d7587;
      }
    }

    .el-select__wrapper {
      font-size: var(--el-font-size-base);
      height: 40px;
    }

    .el-select {
      --el-text-color-placeholder: #6d7587;
    }

    .el-textarea__inner {
      &::placeholder {
        color: #6d7587;
      }
    }

    .el-radio {
      --el-radio-font-weight: 400;
    }

    .el-form-item__label {
      font-weight: 400;
    }

    .el-checkbox {
      --el-checkbox-font-size: 16px;
      --el-checkbox-text-color: theme.$text-color-primary;
      --el-checkbox-height: 24px;
    }

    .el-checkbox__label {
      line-height: 24px;
    }

    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .termsItem {
    margin-top: -5px;
    margin-bottom: 32px;
  }
}

.link {
  color: #086df4;
  font-weight: 400;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

.submit {
  width: 100%;
  --el-button-bg-color: #086df4;
  border-radius: 6px;
  height: 40px;
}
</style>
