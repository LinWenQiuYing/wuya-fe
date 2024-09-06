// MOD from https://github.com/audiojs/audio-buffer-remix

import { Channels } from "./type";

const speakerMap = {
  1: {
    2: [0, 0],
    4: [0, 0, null, null],
    6: [null, null, 0, null, null],
  },
  2: {
    1: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let right = source.getChannelData(1);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = 0.5 * (left[i] + right[i]);
        }
      },
    ],
    4: [0, 1, null, null],
    6: [0, 1, null, null, null, null],
  },
  4: {
    1: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let right = source.getChannelData(1);
        let sleft = source.getChannelData(2);
        let sright = source.getChannelData(3);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = 0.25 * (left[i] + right[i] + sleft[i] + sright[i]);
        }
      },
    ],
    2: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let sleft = source.getChannelData(2);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = 0.5 * (left[i] + sleft[i]);
        }
      },
      (dest, source: AudioBuffer) => {
        let right = source.getChannelData(1);
        let sright = source.getChannelData(3);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = 0.5 * (right[i] + sright[i]);
        }
      },
    ],
    6: [0, 1, null, null, 2, 3],
  },
  6: {
    1: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let right = source.getChannelData(1);
        let center = source.getChannelData(2);
        let sleft = source.getChannelData(4);
        let sright = source.getChannelData(5);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = 0.7071 * (left[i] + right[i]) + center[i] + 0.5 * (sleft[i] + sright[i]);
        }
      },
    ],
    2: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let center = source.getChannelData(2);
        let sleft = source.getChannelData(4);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = left[i] + 0.7071 * (center[i] + sleft[i]);
        }
      },
      (dest, source: AudioBuffer) => {
        let right = source.getChannelData(1);
        let center = source.getChannelData(2);
        let sright = source.getChannelData(5);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = right[i] + 0.7071 * (center[i] + sright[i]);
        }
      },
    ],
    4: [
      (dest, source: AudioBuffer) => {
        let left = source.getChannelData(0);
        let center = source.getChannelData(2);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = left[i] + 0.7071 * center[i];
        }
      },
      (dest, source: AudioBuffer) => {
        let right = source.getChannelData(1);
        let center = source.getChannelData(2);
        for (let i = 0, l = dest.length; i < l; i++) {
          dest[i] = right[i] + 0.7071 * center[i];
        }
      },
      4,
      5,
    ],
  },
};

const discreteMap = Array(32)
  .fill(0)
  .map((v, i) => i);

type RemixOptions = {
  interpretation?: string;
};

function remix(source: AudioBuffer, channels: Channels, options?: string | RemixOptions): AudioBuffer {
  const inputChannels = source.numberOfChannels;

  //shortcut same number
  if (channels === inputChannels) return source;

  const interpretation = typeof options === "string" ? options : options?.interpretation ?? "speaker";

  //obtain map
  let map;
  if (interpretation == "discrete") {
    map = discreteMap.slice(0, channels);
  } else {
    let inputMap = speakerMap[inputChannels];
    if (inputMap) {
      map = inputMap[channels];
    }
    //if match is not found - do discrete interpretation
    if (!map) {
      map = discreteMap.slice(0, channels);
    }
  }

  //source is buffer list - do per-buffer mapping
  if (source.map) {
    return source.map(mapBuffer);
  }
  //otherwise map once
  else {
    return mapBuffer(source);
  }

  function mapBuffer(source: AudioBuffer): AudioBuffer {
    let dest = new AudioBuffer({
      length: source.length,
      numberOfChannels: channels,
      sampleRate: source.sampleRate,
      channelCount: channels,
      channelCountMode: "explicit",
      channelInterpretation: "speakers",
    });
    for (let c = 0; c < channels; c++) {
      let outputData = dest.getChannelData(c);
      let mapper = map[c];
      if (mapper == null) continue;
      if (typeof mapper == "number") {
        if (mapper >= source.numberOfChannels) continue;
        let inputData = source.getChannelData(mapper);
        outputData.set(inputData);
      } else if (typeof mapper == "function") {
        mapper(outputData, source);
      }
    }
    return dest;
  }
}

export default remix;
