import html2canvas from "html2canvas";
import useUserInfo from "@/store/hooks/useUserInfo";

import { saveImgCode } from "../../api/invite";
import { userPrefix } from "@/utils/reqPrefix";

const userInfo = useUserInfo();
//下载图片
export const useConvertToImage = async (qrcode: HTMLElement): Promise<void> => {
  const clone = <HTMLElement>qrcode.cloneNode(true);
  clone.style.display = "block";
  clone.style.visibility = "visible";
  document.body.appendChild(clone);

  await html2canvas(clone)
    .then(async (canvas) => {
      const url = canvas.toDataURL("image/png");
      const res = await saveImgCode(url);
      const link = document.createElement("a");
      link.href = `${userPrefix}/invite/any/download-img?uuid=${res}&filename=无涯问知邀请码.png`;
      link.click();
      document.body.appendChild(link);
      // 清理
      link.remove();
    })
    .finally(() => {
      document.body.removeChild(clone);
    });
};
