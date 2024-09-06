//将包含child的数据解析构成穿梭树需要的结构
export function getChildData(arr) {
  const result = [];
  // 遍历 tree
  arr.forEach((item) => {
    // 赋值
    const id = item.id;
    const wyFileId = item.id;
    const label = item.name;
    const pid = item.parentId == -1 ? null : item.parentId;
    const status = item.fileStatus;
    const category = item.category;
    const fileName = item.name;
    const encodingFileName = item.fileMd5;
    const filePath = item.filePath;
    let children = item.children;
    // 如果有子节点，递归
    if (children && children.length) {
      children = getChildData(children);
    }
    result.push({
      id,
      label,
      pid,
      status,
      category,
      fileName,
      encodingFileName,
      filePath,
      children,
      wyFileId,
    });
  });
  return result;
}
