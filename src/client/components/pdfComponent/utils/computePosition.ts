const padding = 16;
const computePosition = (
  ePage: {
    pageX: number;
    pageY: number;
  },
  box: HTMLDivElement,
  tip: {
    width: number;
    height: number;
  },
) => {
  const boxWidth = box.clientWidth;
  const boxHeight = box.clientHeight;
  const maxPageX = boxWidth - tip.width - padding;
  const maxPageY = boxHeight - tip.height - padding;
  const getPageX = () => {
    if (ePage.pageX < 0) {
      return padding;
    } else if (ePage.pageX > maxPageX) {
      return maxPageX;
    }
    return ePage.pageX;
  };
  const getPageY = () => {
    if (ePage.pageY < 0) {
      return padding;
    } else if (ePage.pageY > maxPageY) {
      return maxPageY;
    }
    return ePage.pageY;
  };
  const pageX = getPageX();
  const pageY = getPageY();
  const x = pageX + box.offsetLeft;
  const y = pageY + box.offsetTop;
  return {
    x,
    y,
  };
};

export default computePosition;
