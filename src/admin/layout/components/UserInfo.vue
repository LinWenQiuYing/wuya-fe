<template>
  <div :class="[$style._, props.class]">
    <router-link to="/" :class="$style.link" title="切换到用户端页面">
      <Switch />
      <span>用户端</span>
    </router-link>
    <UserMenu reverse-meta reverse-menu size="sm" />
  </div>
</template>

<script lang="ts" setup>
import { Switch } from "@element-plus/icons-vue";
import UserMenu from "@/sign/components/UserMenu.vue";

const props = defineProps<{ class: string }>();
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.link {
  padding: 0 20px;
  font-size: 14px;
  color: theme.$color-primary;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 14px;
    margin: 0 5px;
  }
}
</style>
