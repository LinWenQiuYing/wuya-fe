<template>
  <div :class="$style._">
    <ul :class="[$style.list, { dif: isMobile }]">
      <li>账户信息</li>
      <li>
        <label :class="$style.label">头像</label>
        <div :class="isMobile ? $style.accountRight : $style.account_avatar">
          <img :src="avatar ? avatar : defaultAvatarURL" />

          <router-link v-if="isMobile" :class="$style.editBtn" :to="{ name: 'avatar' }">
            <ArrowRight :class="$style.rightArrow" />
          </router-link>
          <button
            v-if="!isMobile"
            type="button"
            :class="$style.patchBtn"
            @click="() => (avatarEditDialogVisible = true)"
          >
            <EditIcon />
          </button>
        </div>
        <AvatarEditDialog
          v-if="avatarEditDialogVisible"
          v-model="avatarEditDialogVisible"
          :avatar="avatar"
          @change="updateAvatar"
        />
      </li>
      <li>
        <label :class="$style.label">用户名</label>
        <InlineEditor
          v-if="!isMobile"
          v-model="isUsernameEditing"
          :class="$style.editor"
          :value="username"
          @change="updateUsername"
        />
        <span v-if="isMobile" :class="{ mobile: isMobile }">{{ username ? username : "" }}</span>
        <router-link v-if="isMobile" :class="$style.editBtn" :to="{ name: 'userSetting' }">
          <ArrowRight :class="$style.rightArrow" />
        </router-link>
      </li>
      <li>
        <label :class="$style.label">密码</label>
        <span v-if="isMobile" :class="{ mobile: isMobile }">******</span>
        <button
          v-if="!isMobile"
          type="button"
          :class="$style.setBtn"
          @click="() => (passwordEditDialogVisible = true)"
        >
          {{ userInfo?.status == 1 ? "修改密码" : "设置密码" }}
        </button>
        <router-link
          v-if="isMobile"
          :class="$style.editBtn"
          :to="{ name: userInfo?.status == 1 ? 'passwordChange' : 'verifyPhone' }"
        >
          <ArrowRight :class="$style.rightArrow" />
        </router-link>
        <!--        修改密码弹窗-->
        <PasswordEditDialog
          v-if="userInfo?.status == 1 && passwordEditDialogVisible"
          v-model="passwordEditDialogVisible"
        />
        <!--        初次填写密码弹窗-->
        <PasswordFirstSet
          v-if="userInfo?.status !== 1 && passwordEditDialogVisible"
          v-model="passwordEditDialogVisible"
        />
      </li>
      <li>
        <label :class="$style.label">手机号</label>
        <span :class="{ mobile: isMobile }">{{ userInfo?.phone ?? "绑定手机号" }}</span>
        <button
          v-if="!isMobile"
          type="button"
          :class="$style.editBtn"
          @click="() => (phoneEditDialogVisible = true)"
        >
          <EditIcon />
        </button>
        <router-link v-if="isMobile" :class="$style.editBtn" :to="{ name: 'numberSetting' }">
          <ArrowRight :class="$style.rightArrow" />
        </router-link>
        <PhoneEditDialog v-if="phoneEditDialogVisible" v-model="phoneEditDialogVisible" />
      </li>
      <li>
        <label :class="$style.label">邮箱</label>
        <template v-if="isMobile">
          <span :class="{ mobile: isMobile }">{{ userInfo?.email ?? "绑定邮箱" }}</span>
          <router-link :class="$style.editBtn" :to="{ name: 'emailSetting' }">
            <ArrowRight :class="$style.rightArrow" />
          </router-link>
        </template>
        <template v-else>
          <span>{{ userInfo?.email }}</span>
          <button
            v-if="!isMobile"
            type="button"
            :class="userInfo?.email ? $style.editBtn : $style.setBtn"
            @click="() => (emailEditDialogVisible = true)"
          >
            <EditIcon v-if="userInfo?.email" />
            <span v-else>绑定邮箱</span>
          </button>
          <EmailEditDialog v-if="emailEditDialogVisible" v-model="emailEditDialogVisible" />
        </template>
      </li>
      <li :class="{ baseLine: isMobile }">
        <div :class="$style.label">
          <p>保留使用数据</p>
          <p :class="isMobile ? $style.mobileText : $style.tips">
            开启此选项后，将允许无涯采用您的历史记录，提高回答的准确性和相关度
          </p>
        </div>
        <el-switch v-model="shareUsage" :class="$style.switch" />
      </li>
    </ul>
    <ul :class="$style.list">
      <li>设置</li>
      <li v-if="!isTagQuery">
        <label :class="$style.label">
          <p>订阅</p>
          <span v-if="!isMobile" :class="$style.tips">
            <span :class="$style.shy">企业版用户需求请</span>
            <ContactUsLink>联系我们</ContactUsLink>
          </span>
        </label>
        <MembershipBar />
      </li>
      <li v-if="!isMobile">
        <div :class="$style.label">
          <p>默认回答语言</p>
          <p :class="$style.tips">设置后将作为模型回答的默认语言</p>
        </div>
        <LanguageSelect v-model="defaultLanguage" :class="$style.select" />
      </li>
      <li>
        <div :class="$style.label">
          <p>默认回答模型</p>
          <p v-if="!isMobile" :class="$style.tips">会员可使用远程无涯大模型、远程无涯小模型等</p>
        </div>
        <ModelSelect v-model="defaultModel" :class="$style.select" />
      </li>
      <li>
        <div :class="$style.label">
          <p>默认知识源</p>
          <p v-if="!isMobile" :class="$style.tips">
            会员可构建个人知识库、使用互联网、财经、法律等多种知识源
          </p>
        </div>
        <SourcesSelect v-model="defaultSources" :class="$style.select" />
      </li>
      <li>
        <div :class="$style.label">
          <p>参考来源数量</p>
          <p v-if="!isMobile" :class="$style.tips">设置模型回答时参考来源的最大数量</p>
        </div>
        <ReferencesLimitSelect v-model="referencesLimit" :class="$style.select" />
      </li>
      <li v-if="target.isElectron">
        <div :class="$style.label">
          <p>版本信息</p>
        </div>
        <version-information />
        <update-button />
      </li>
    </ul>
    <button v-if="isMobile" type="button" :class="$style.quit" @click="() => reAuth({ logout: true })">
      退出登录
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { isMobile, target } from "@/config";
import EditIcon from "@/client/icons/pencil-line.svg";
import AvatarEditDialog from "../AvatarEditDialog.vue";
import InlineEditor from "../InlineEditor.vue";
import PasswordEditDialog from "../PasswordEditDialog.vue";
import PasswordFirstSet from "../PasswordFirstSet.vue";
import PhoneEditDialog from "../PhoneEditDialog.vue";
import EmailEditDialog from "../EmailEditDialog.vue";
import ReferencesLimitSelect from "../ReferencesLimitSelect.vue";
import ContactUsLink from "../ContactUsLink.vue";
import SourcesSelect from "../SourcesSelect.vue";
import ModelSelect from "../ModelSelect.vue";
import VersionInformation from "../VersionInformation.vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import useAvatar, { setAvatar } from "@/store/hooks/useAvatar";
import useUsername, { setUsername } from "../useUsername";
import useShareUsage from "../useShareUsage";
import useDefaultModel from "../useDefaultModel";
import useDefaultSources from "../useDefaultSources";
import useReferencesLimit from "../useReferencesLimit";
import defaultAvatarURL from "@/assets/image/robot.svg?url";
import LanguageSelect from "../LanguageSelect.vue";
import useDefaultLanguage from "../useDefaultLanguage";
import reAuth from "@/sign/reAuth";
import UpdateButton from "../UpdateButton.vue";
import omitRestQueryValue from "@/utils/omitRestQueryValue";
import { useRoute } from "vue-router";
import MembershipBar from "../membership/MembershipBar.vue";

const userInfo = useUserInfo();
const avatar = useAvatar();
const username = useUsername();
const shareUsage = useShareUsage();
const defaultModel = useDefaultModel();
const defaultSources = useDefaultSources();
const referencesLimit = useReferencesLimit();
const defaultLanguage = useDefaultLanguage();

const avatarEditDialogVisible = ref(false);
const passwordEditDialogVisible = ref(false);
const phoneEditDialogVisible = ref(false);
const emailEditDialogVisible = ref(false);
const isUsernameEditing = ref(false);
const route = useRoute();
const isTagQuery = omitRestQueryValue(route.query.tag) === "off";

const updateAvatar = async (dataURL: string) => {
  const success = await setAvatar(dataURL);
  if (!success) return;
  avatarEditDialogVisible.value = false;
};
const updateUsername = async (username: string) => {
  const success = await setUsername(username);
  if (!success) return;
  isUsernameEditing.value = false;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  //min-width: 375px;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  > h3 {
    height: 32px;
    font-weight: bold;
    font-size: 18px;
    color: #2d364d;
    line-height: 32px;
    text-align: left;
    font-style: normal;
    margin: 36px 0 8px;
  }
}

.list {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0 24px;
  margin-top: 18px;

  &:global(.dif) {
    padding: 0 15px;
  }

  :global(.baseLine) {
    display: flex;
    align-items: baseline;
  }

  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 24px;
    padding: 20px 0;
    margin: 0;

    &:first-child {
      color: #2d364d;
      font-weight: 600;
    }
  }

  :global(.mobile) {
    font-weight: 400;
    font-size: 16px;
    color: #6d7587;
  }

  .mobileText {
    font-weight: 400;
    font-size: 14px;
    color: #bbbbbb;
  }

  > li + li {
    border-top: 1px solid #d6dae6;
  }
}

// 标准行高是24px, 但内部使用了input框, 高度为34px, 则需要:

// 1. 展示时行高也统一为34px

// 2. 垂直方向使用负外边距减去多占用的10px空间
.editor {
  line-height: 34px;
  margin: -5px -4px;
}

.switch {
  margin-right: 4px;
}

.label {
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 24px;
  font-weight: 400;
  margin-right: auto;
}

.widthInput {
  line-height: 34px;
  margin-top: -5px;
  margin-bottom: -5px;
}

.tips {
  font-size: 14px;
  color: #6d7587;
  line-height: 22px;
  font-weight: 400;
  display: flex;
  gap: 4px;
}

.shy {
  font-weight: 400;
}

.linkBtn {
  margin: 0 4px;
  color: #086df4;
  background: transparent;
  border: 0 none;
  box-shadow: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.account_avatar {
  width: 56px;
  height: 56px;
  position: relative;
  padding-right: 6px;
  box-sizing: content-box;
  margin-right: -1px;

  > img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
  }
}

.accountRight {
  display: flex;
  align-items: center;

  > img {
    width: 42px;
    height: 42px;
  }
}

.patchBtn {
  width: 24px;
  height: 24px;
  background-color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.rightArrow {
  color: #999999;
}

.setBtn {
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 88px;
  height: 30px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #dddfe3;
  font-size: 14px;
  color: #2d364d;
  transition: color 0.3s ease-in-out;
}

.patchBtn,
.editBtn {
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  padding-left: 8px;
  background-color: transparent;

  &:hover {
    color: theme.$color-primary;
  }

  svg {
    width: 18px;
    fill: currentColor;
  }
}

.patchBtn {
  width: 24px;
  height: 24px;
  background-color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.upgradeBtn {
  background-image: linear-gradient(-70deg, #1776ff 0%, #6ac9ff 100%);
  border-radius: 6px;
  width: 88px;
  height: 30px;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #eee;
  transition: color 0.3s ease-in-out;
  margin-left: 12px;

  &:hover {
    color: #fff;
  }
}

.input {
  width: 160px;
  margin-right: 5px;
  height: 30px;
}

.select {
  width: 240px;

  :global {
    .el-select__wrapper {
      min-height: 30px;
      line-height: 20px;
    }
  }
}

.quit {
  width: 100%;
  height: 42px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 16px;
  color: #2d364d;
  border: none;
  box-shadow: none;
  margin-top: 21px;
}
</style>
