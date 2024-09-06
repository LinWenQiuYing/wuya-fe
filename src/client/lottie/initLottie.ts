import lottie, { AnimationConfig, AnimationItem } from "lottie-web";

const initLottie = (data: string, container: HTMLTimeElement, params?: AnimationConfig): AnimationItem => {
  return lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData: data,
    ...params,
  });
};
export default initLottie;
