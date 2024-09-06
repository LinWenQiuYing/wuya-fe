import { ByteNotation } from "@/utils/isByteNotation";
import { TimeNotation } from "@/utils/isTimeNotation";
import UploadFilesIcon from "@/client/icons/upload-files.svg";
import UploadPicsIcon from "@/client/icons/upload-pics.svg";

// 上传文件时, 可接受的文件后缀名
export const acceptableExtensions: string =
  ".pdf,.docx,.mp3,.mp4,.jpg,.png,.jpeg,.wav,.ogg,.aac,.flac,.m4a,.avi,.flv,.wmv,.mkv,.gif,.bmp,.doc,.txt,.xlsx,.csv,.weba";

export const wxUploadInfo = [
  // 安卓端微信内置浏览器，包含下列格式会导致文件上传时只能选择 “拍摄” 和 “从相册选择”
  {
    icon: UploadPicsIcon,
    name: "上传图片",
    desc: "支持格式：mp4、jpg、png、jpeg、avi、wmv、gif、bmp、weba",
    accept: ".mp4,.jpg,.png,.jpeg,.avi,.wmv,.gif,.bmp,.weba",
  },
  // 剩余格式。点击上传时会跳转到手机文件系统的选择文件页面
  {
    icon: UploadFilesIcon,
    name: "上传文件",
    desc: "支持格式：pdf、docx、mp3、wav、ogg、aac、flac、m4a、flv、mkv、doc、txt、xlsx、csv",
    accept: ".pdf,.docx,.mp3,.wav,.ogg,.aac,.flac,.m4a,.flv,.mkv,.doc,.txt,.xlsx,.csv",
  },
];

// 单个文件最大比特数
export const singleFileMaxBytes: ByteNotation = "200M";

// 文件名最大长度
export const filenameMaxLength: number = 256;

// 上传可用性检查结果的过期时间
export const availableCheckExpired: TimeNotation = "30s";
