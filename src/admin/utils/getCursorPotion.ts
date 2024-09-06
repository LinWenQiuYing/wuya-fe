// 获取鼠标光标的位置
export const getCursorPotion = () => {
  const selection = window.getSelection();
  if (!selection) return null;
  const range = selection.getRangeAt(0);
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;
  return { start: startOffset, end: endOffset };
};
