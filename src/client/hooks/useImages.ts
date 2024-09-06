//获取图片
import { getPdf } from "@/client/api/documents";
import { getFinanceImage } from "@/client/api/documents";
import { getSubString } from "@/client/utils";

// export const useImages = () => {
//   return async (ids: string[]) => {
//     const data = Promise.allSettled(ids.map((item_id) => getPdf(item_id, true)));
//     console.log(data);
//     return (await data)
//       .filter((item) => item.status === "fulfilled")
//       .map((item: PromiseFulfilledResult<any>) => {
//         return item.value;
//       });
//   };
// };
export const useImages = () => {
  return async (reference: any[]) => {
    const data = Promise.allSettled(
      reference.map((item) => {
        if (item.document_id) {
          const id = item.uid.substr(item.uid.indexOf(item?.document_id));
          return getPdf(id, true);
        } else if (item.positions) {
          return getFinanceImage({
            docName: getSubString(item.title),
            image: true,
            positions: item.positions,
            pages: item.document_pages,
          });
        }
      }),
    );
    return (await data)
      .filter((item) => item.status === "fulfilled")
      .map((item: PromiseFulfilledResult<any>) => {
        return item.value;
      });
  };
};

export function usePdfImagesUrl() {
  const getImages = useImages();
  return async (reference: any[]) => {
    const data = await getImages(reference);
    const images = data
      .filter((item) => !!item)
      .map((image) => {
        const blob = new Blob([image]);
        const url = window.URL.createObjectURL(blob);
        return url;
      });
    return images;
  };
}
