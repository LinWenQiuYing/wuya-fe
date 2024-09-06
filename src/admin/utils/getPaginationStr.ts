/**
 *
 * @param currentPage 当前页数
 * @param pageSize 每页条数
 * @param total 数据数量
 */
export const getPaginationStr = (currentPage: number, pageSize: number, total: number) => {
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = currentPage * pageSize > total ? total : currentPage * pageSize;
  // const num = total === 0 ? 0 : end - start + 1;
  return `第${start}-${end}项 / 共 ${total}项`;
};
