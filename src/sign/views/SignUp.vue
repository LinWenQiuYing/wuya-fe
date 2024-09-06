<template>
  <SignHeader title="注册账号">
    <SignNavigator v-if="!isMiniProgram" />
  </SignHeader>
  <SignUpForm />
</template>
<script setup lang="ts">
import SignHeader from "@/sign/components/SignHeader.vue";
import SignUpForm from "@/sign/forms/SignUpForm.vue";
import SignNavigator from "@/sign/components/SignNavigator.vue";
import { isMiniProgram } from "@/utils/wxUtils";
</script>
