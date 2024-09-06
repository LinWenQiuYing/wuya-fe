<template>
  <Suspense>
    <StarrySky v-slot="slotProps">
      <SignBox :class="slotProps.class">
        <RouterView />
      </SignBox>
      <ICP :class="$style.icp" />
    </StarrySky>
  </Suspense>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import SignBox from "../components/SignBox.vue";
import StarrySky from "../components/StarrySky.vue";
import useAuthorization from "@/store/hooks/useAuthorization";
import redirectBack from "../redirectBack";
import getSignConfig from "@/sign/getSignConfig";
import ICP from "@/client/components/ICP.vue";

const authorization = useAuthorization();

onMounted(async () => {
  const sign = await getSignConfig();
  if (sign.auto && authorization.value && !/autosign=false/.test(location.href)) {
    await redirectBack().catch(console.error);
  }
});
</script>
<style lang="scss" module>
@use "src/styles/theme";

.icp {
  position: fixed;
  bottom: 30px;
  margin: 0 auto;

  a:hover {
    color: white;
  }
}
</style>
