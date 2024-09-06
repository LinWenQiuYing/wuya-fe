import fileToArrayBuffer from "./fileToArrayBuffer";
import remix from "./remix";
import { Muxer, ArrayBufferTarget } from "webm-muxer";
import type { Channels } from "./type";

function bufferToF32Planar(input: AudioBuffer) {
  const result = new Float32Array(input.length * input.numberOfChannels);
  let offset = 0;
  for (let i = 0; i < input.numberOfChannels; i++) {
    const data = input.getChannelData(i);
    result.set(data, offset);
    offset = data.length;
  }
  return result;
}

// 从视频文件中提取音轨
const extract = async (
  file: File,
  // 提取后的文件的文件名, 不设置则使用默认的
  filename?: string,
  sampleRate: number = 16000,
  outputChannels: Channels = 2,
) => {
  // AudioEncoder is available only in secure contexts (HTTPS), in some or all supporting browsers.
  if (typeof AudioEncoder === "undefined") return file;
  const arrayBuffer = await fileToArrayBuffer(file);
  const audioContext = new AudioContext({ sampleRate });
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const remixedBuffer = remix(audioBuffer, outputChannels);

  const audioData = new AudioData({
    format: "f32-planar",
    sampleRate: remixedBuffer.sampleRate,
    numberOfChannels: remixedBuffer.numberOfChannels,
    numberOfFrames: remixedBuffer.length,
    timestamp: 0,
    data: bufferToF32Planar(remixedBuffer),
  });

  const webmMuxer = new Muxer({
    target: new ArrayBufferTarget(),
    audio: {
      codec: "A_OPUS",
      numberOfChannels: outputChannels,
      sampleRate: audioBuffer.sampleRate,
    },
    firstTimestampBehavior: "offset",
  });

  const audioEncoder = new AudioEncoder({
    output: (chunk, meta) => {
      webmMuxer.addAudioChunk(chunk, meta);
    },
    error: (e) => {
      throw e;
    },
  });

  const encoderOption: AudioEncoderConfig = {
    codec: "opus",
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: outputChannels,
  };
  audioEncoder.configure(encoderOption);
  audioEncoder.encode(audioData);

  await audioEncoder.flush();
  webmMuxer.finalize();
  const { buffer } = webmMuxer.target;

  const blob = new Blob([buffer], { type: "audio/webm; codecs=opus" });
  return new File([blob], filename ?? file.name.replace(/\..+$/, ".weba"), { type: "audio/weba" });
};

export default extract;
