<template>
  <SignHeader title="验证码登录">
    <AggressiveLink path="/sign/in">切换密码登录</AggressiveLink>
  </SignHeader>
  <SignForm />
</template>
<script setup lang="ts">
import SignHeader from "@/sign/components/SignHeader.vue";
import SignForm from "@/sign/forms/SignForm.vue";
import AggressiveLink from "@/sign/components/AggressiveLink.vue";
</script>
