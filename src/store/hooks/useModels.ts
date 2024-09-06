import { getModels, Model } from "@/client/api/chat";
import store from "..";
import { computed, onMounted } from "vue";
import { Set_Models } from "../modules/model";

export default function useModels() {
  const models = computed(() => store.state.model.models);

  const setModels = (models: Model[]) => {
    store.commit(`model/${Set_Models}`, models);
  };

  onMounted(async () => {
    if (models.value.length) return;
    const value = await getModels().catch(() => console.error("模型列表获取出错"));
    if (value) {
      setModels(value);
    }
  });

  return models;
}
