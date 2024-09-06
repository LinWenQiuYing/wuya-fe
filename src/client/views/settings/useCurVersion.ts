import { ref, onMounted } from "vue";
import { getCurVersion } from "@/client/api/version";

export default function useCurVersion() {
  const curVersion = ref<string>();

  onMounted(async () => {
    const result = await getCurVersion().catch(console.error);
    if (result) {
      curVersion.value = result.display_version;
    }
  });
  return curVersion;
}
