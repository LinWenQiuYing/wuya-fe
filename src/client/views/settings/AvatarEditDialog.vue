<template>
  <el-dialog v-model="visible" :class="$style._">
    <template #header>
      <div :class="$style.header">设置</div>
    </template>
    <div ref="containerRef" :class="$style.container" />
    <Scaler v-model="percent" @change="scaleKonvaImage" />
    <div :class="$style.uploader" @click="selectOriginalImage">
      <Upload />
      <span>重新上传</span>
      <input ref="inputRef" type="file" accept="image/*" @change="setImage" />
    </div>
    <div :class="$style.footer">
      <el-button @click="cancelEditAvatar">取消</el-button>
      <el-button type="primary" @click="confirmAvatarEdit">确认</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import Scaler from "@/client/views/settings/Scaler.vue";
import { Upload } from "@element-plus/icons-vue";
import Konva from "konva";
import defaultAvatarURL from "@/assets/image/robot.svg?url";
import fileToDataURL from "@/client/utils/fileToDataURL";
import loadImage from "@/client/utils/loadImage";

type Range = [number, number];

const props = defineProps<{
  // 缩放范围, 默认是 [0.2, 4]
  scaleRange?: Range;
  avatar: string | null;
}>();
const visible = defineModel<boolean>();
const emit = defineEmits<{
  change: [string];
}>();

const containerRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();

const toFixed = (value: number) => Number.parseFloat(value.toFixed(2));

// 默认缩放范围
const defaultRange: Range = [0.2, 4];

// 缩放范围
const scaleRange = props.scaleRange ?? defaultRange;

// 缩放率(scale ratio)
const scaleRatio = scaleRange[1] - scaleRange[0];

// 默认缩放百分比, 默认百分比对应的缩放率(scale ratio)刚好为1
const defaultPercent = toFixed((1 - scaleRange[0]) / scaleRatio);

// 缩放百分比, 取值范围恒为 [0, 1]
const percent = ref<number>(defaultPercent);

type KonvaStash = {
  stage: Konva.Stage;
  imgClipGroup: Konva.Group;
  canvasWidth: number;
  canvasHeight: number;
  canvasCenter: { x: number; y: number };
  clipRadius: number;
  konvaImage?: Konva.Image;
};

// 用于暂存一些Konva的对象, 方便后续操作
const konvaRef: { value?: KonvaStash } = {};

// 根据percent值获取对应的缩放比例
const getScaleByPercent = (percentValue: number) => {
  const [min] = scaleRange;
  return toFixed(min + scaleRatio * percentValue);
};

const scaleKonvaImage = (percentValue: number) => {
  const konva = konvaRef.value;
  if (!konva) return;
  const { konvaImage, canvasWidth, canvasHeight } = konva;
  if (!konvaImage) return;
  const scale = getScaleByPercent(percentValue);
  const imageWidth = <number>konvaImage.getWidth();
  const imageHeight = <number>konvaImage.getHeight();
  const scaleX = <number>konvaImage.getAttr("scaleX");
  const scaleY = <number>konvaImage.getAttr("scaleY");
  const imagePosition = konvaImage.position();
  const imageCenter = {
    x: (imageWidth - imagePosition.x) / 2,
    y: (imageHeight - imagePosition.y) / 2,
  };
  // 缩放时, 除了缩放图标大小, 还需要缩放图片的坐标(x,y)到canvas中心点的距离
  // 坐标是指右上角的位置
  // 假设canvas中心点的坐标是 (cx, cy), 由缩放 scale1 及图片坐标 (x1, y1) 变换为缩放 scale2 及图片坐标 (x2, y2)
  // 那么应满足等式:
  // (cx - x1) / scale1 = (cx - x2) / scale2
  // (cy - y1) / scale1 = (cy - y2) / scale2
  // 上述等式是求取图片新坐标(x2, y2)的基础
  // x2 = cx - (cx - x1) * scale2 / scale1
  // y2 = cy - (cy - y1) * scale2 / scale1
  const nextPosition = {
    x: toFixed(imageCenter.x - ((imageCenter.x - imagePosition.x) * scale) / scaleX),
    y: toFixed(imageCenter.y - ((imageCenter.y - imagePosition.y) * scale) / scaleY),
  };
  konvaImage.setAttrs({
    ...nextPosition,
    scaleX: scale,
    scaleY: scale,
    width: canvasWidth,
    height: canvasHeight,
  });
  console.log(
    `scale: ${scaleX}, position: (${imagePosition.x}, ${imagePosition.y}) => scale: ${scale}, position: (${nextPosition.x}, ${nextPosition.y})`,
  );
};

const addKonvaImage = async (imageURL: string) => {
  const konva = konvaRef.value;
  if (!konva) return;
  const { canvasWidth, canvasHeight, imgClipGroup, canvasCenter } = konva;
  const isDefaultAvatar = !props.avatar;
  // 默认头像是一个svg, 它内部有留白不能百分百填充拆剪区域
  // 当是默认头像时, 初始化的缩放值不是1
  const initScale = isDefaultAvatar ? 1.05 : 1;
  const image = await loadImage(imageURL);
  const konvaImage = new Konva.Image({
    x: toFixed((1 - initScale) * canvasCenter.x),
    y: toFixed((1 - initScale) * canvasCenter.y),
    scaleX: initScale,
    scaleY: initScale,
    image: image,
    width: canvasWidth,
    height: canvasHeight,
    draggable: true,
  });
  imgClipGroup.removeChildren();
  imgClipGroup.add(konvaImage);
  konvaRef.value = { ...konva, konvaImage };
  // konvaImage.on("dragmove", (e) => {
  //   console.log(e.target);
  // });
};

const initCanvas = async (container: HTMLDivElement) => {
  const canvasWidth = container.clientWidth;
  const canvasHeight = container.clientHeight;
  const canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };
  const clipRadius = Math.min(canvasCenter.x, canvasCenter.y);

  const stage = new Konva.Stage({
    container,
    width: canvasWidth,
    height: canvasHeight,
  });
  const layer = new Konva.Layer();

  const imgClipGroup = new Konva.Group({
    clipFunc: function (ctx) {
      ctx.arc(canvasCenter.x, canvasCenter.y, clipRadius, 0, Math.PI * 2);
    },
  });

  const background = new Konva.Circle({
    ...canvasCenter,
    radius: clipRadius,
    fill: "#f0f2f7",
  });

  layer.add(background);

  layer.add(imgClipGroup);
  // add the layer to the stage
  stage.add(layer);

  konvaRef.value = {
    stage,
    canvasWidth,
    canvasHeight,
    canvasCenter,
    clipRadius,
    imgClipGroup,
  };

  await addKonvaImage(props.avatar ?? defaultAvatarURL);
};

onMounted(async () => {
  await nextTick();
  const container = containerRef.value;
  if (!container) {
    console.error("canvas container not ready!");
    return;
  }
  await initCanvas(container);
});

const setImage = async (event: Event) => {
  const files = (<HTMLInputElement>event.target).files;
  if (!files) return;
  const base64 = await fileToDataURL(files[0]).catch(console.error);
  if (!base64) return;
  await addKonvaImage(base64);
};

const closeEditDialog = () => {
  visible.value = false;
};

const cancelEditAvatar = () => {
  closeEditDialog();
};

const confirmAvatarEdit = () => {
  const konva = konvaRef.value;
  if (!konva) return;
  const { imgClipGroup, canvasWidth, canvasHeight } = konva;
  const dataURL = imgClipGroup.toDataURL({ x: 0, y: 0, width: canvasWidth, height: canvasHeight });
  emit("change", dataURL);
};

const selectOriginalImage = () => {
  const inputElement = inputRef.value;
  if (!inputElement) return;
  inputElement.click();
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  width: 360px;
  padding-bottom: 0;
}

.header {
  font-size: theme.$font-size-lg;
  color: theme.$text-color-primary;
  font-weight: 700;
}

.container {
  width: 174px;
  height: 174px;
  margin: 15px auto;
  display: block;
}

.uploader {
  margin: 15px auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  color: theme.$text-color-primary;

  &:hover {
    color: theme.$color-primary;
  }

  input {
    display: none;
  }

  svg {
    width: 14px;
  }
}

.footer {
  border-top: 1px solid #e5eaf5;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 -16px;
}
</style>
