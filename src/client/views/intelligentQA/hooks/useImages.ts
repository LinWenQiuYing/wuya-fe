import { getImages } from "@/client/api/chat";
import { ref } from "vue";

export default function useImages() {
  const images = ref([]);
  const _getImages = async (text: string, number: number) => {
    const result = await getImages(text, number);
    images.value = result;
  };

  return {
    images,
    getImages: _getImages,
  };
}
