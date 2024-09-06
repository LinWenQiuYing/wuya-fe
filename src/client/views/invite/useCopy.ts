import { ElMessage } from "element-plus";

export default async function copyText(text = "") {
  try {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage.success("复制成功");
        return Promise.resolve();
      })
      .catch((err) => {
        ElMessage.error("复制失败");
        return Promise.reject(err);
      });
  } catch (e) {
    let input = document.createElement("input");
    input.style.position = "fixed";
    input.style.top = "-10000px";
    input.style.zIndex = "-999";
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    try {
      let result = document.execCommand("copy");
      document.body.removeChild(input);
      if (!result) {
        ElMessage.error("复制失败");
        return Promise.reject("复制失败");
      } else {
        ElMessage.success("复制成功");
        return Promise.resolve();
      }
    } catch (e) {
      document.body.removeChild(input);
      ElMessage.error("当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作");
      return Promise.reject("当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作");
    }
  }
}
