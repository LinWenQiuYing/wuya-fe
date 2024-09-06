import { computed, ComputedRef, ModelRef } from "vue";
import qrcode from "qrcode-generator";
// URL转img
export const useUrlToQRCode = (linkUrl: ModelRef<string>): ComputedRef<string> => {
  return computed(() => {
    const qr = qrcode(0, "H");
    qr.addData(linkUrl.value);
    qr.make();
    // 创建一个隐藏的 canvas 元素
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // 设置 canvas 大小
    canvas.width = qr.getModuleCount() * 4;
    canvas.height = qr.getModuleCount() * 4;
    // 填充背景
    context!.fillStyle = "#ffffff";
    context!.fillRect(0, 0, canvas.width, canvas.height);
    // 绘制 QR Code 模块
    for (let x = 0; x < qr.getModuleCount(); x++) {
      for (let y = 0; y < qr.getModuleCount(); y++) {
        if (qr.isDark(x, y)) {
          context!.fillStyle = "#000000";
          context!.fillRect(x * 4, y * 4, 4, 4);
        }
      }
    }
    return canvas.toDataURL("image/png");
  });
};
