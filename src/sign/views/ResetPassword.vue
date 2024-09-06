<template>
  <SignHeader title="找回密码">
    <SignNavigator v-if="!isMiniProgram" />
  </SignHeader>
  <PasswordResetForm />
</template>
<script setup lang="ts">
import SignHeader from "@/sign/components/SignHeader.vue";
import SignNavigator from "@/sign/components/SignNavigator.vue";
import PasswordResetForm from "@/sign/forms/PasswordResetForm.vue";
import { isMiniProgram } from "@/utils/wxUtils";
</script>
<style lang="scss" module>
@use "src/styles/theme";
</style>
