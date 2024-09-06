// 处理mac在拼音模式下输入回车
export default function handleKeyEnter(e: KeyboardEvent, callback: () => void) {
  if (e.isComposing) return;
  callback();
}
