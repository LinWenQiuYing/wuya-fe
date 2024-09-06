<template>
  <el-form-item :class="$style._">
    <slot :class="$style.btn" :spacing="$style.spacing" />
  </el-form-item>
</template>
<style lang="scss" module>
._ {
  margin-top: 30px;
}

.btn {
  width: 100%;
  border-radius: 2px;
}

.spacing {
  letter-spacing: 8px;
  text-indent: 8px;
}
</style>
