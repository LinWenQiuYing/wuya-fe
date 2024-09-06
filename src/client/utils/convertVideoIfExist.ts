// 如果存在视频文件则提取音轨
import extract from "#audio-tracks-extractor";

const convertVideoIfExist = async (file: File): Promise<File> => {
  if (/(^video\/)|(\.mkv$)/.test(file.type)) {
    return await extract(file, file.name);
  } else {
    return Promise.resolve(file);
  }
};

export default convertVideoIfExist;
