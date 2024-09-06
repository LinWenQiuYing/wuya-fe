type InteractionType = "down" | "move";
type Position = { x: number; y: number };
type Timestamp = number;
type InteractionRecord = Position & {
  type: InteractionType;
  t: Timestamp;
};

export type SlideCaptchaTrackData = {
  bgImageWidth: number;
  bgImageHeight: number;
  sliderImageWidth: number;
  sliderImageHeight: number;
  startSlidingTime: string;
  endSlidingTime: string;
  trackList: InteractionRecord[];
};

export type CaptchaType = "SLIDER" | "ROTATE" | "CONCAT" | "WORD_IMAGE_CLICK";

export type CaptchaInitData = {
  captcha: {
    backgroundImage: string;
    backgroundImageHeight: number;
    backgroundImageTag: string;
    backgroundImageWidth: number;
    data: Record<string, unknown>;
    templateImage: string;
    templateImageHeight: number;
    templateImageTag: string;
    templateImageWidth: number;
    type: CaptchaType;
  };
  id: string;
};

type ResponseBody<T> = {
  code: number;
  message: string;
  data: T;
};

export type CaptchaValidator<T = unknown> = (id: string, data: SlideCaptchaTrackData) => Promise<T>;

type CaptchaContext = {};

export type InitConfig<T = unknown> = {
  container: HTMLElement;
  getCaptcha: () => Promise<CaptchaInitData>;
  validateCaptcha: CaptchaValidator<T>;
  onValidateSuccess?: (context: CaptchaContext, data: T) => void;
  onValidateError?: (context: CaptchaContext, data: T) => void;
  onClose?: () => void;
};
