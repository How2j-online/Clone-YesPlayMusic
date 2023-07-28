import type { LyricType } from "@/service/common";

export interface ParsedLyricsType {
  rawTime: string;
  time: number;
  content: string;
}

const extractLrcRegex = /^(?<lyricTimestamps>(?:\[.+?])+)(?!\[)(?<content>.+)$/gm;
const extractTimestampRegex = /\[(?<min>\d+):(?<sec>\d+)[.:]*(?<ms>\d+)*]/g;

export const lyricParser = (lrc: LyricType) => {
  return {
    lyric: parseLyric(lrc?.lrc?.lyric || ""),
    tLyric: parseLyric(lrc?.tlyric?.lyric || ""),
    lyricUser: lrc.lyricUser,
    transUser: lrc.transUser
  };
};

const trimContent = (content: string) => {
  let t = content.trim();
  return t.length < 1 ? content : t;
};

export const parseLyric = (lrc: string) => {
  const parsedLyrics: ParsedLyricsType[] = [];
  const binarySearch = (lyric: ParsedLyricsType) => {
    let time = lyric.time;

    let low = 0;
    let high = parsedLyrics.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midTime = parsedLyrics[mid].time;
      if (midTime === time) {
        return mid;
      } else if (midTime < time) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return low;
  };

  for (const line of lrc.trim().matchAll(extractLrcRegex)) {
    const { lyricTimestamps, content } = line.groups;

    for (const timestamp of lyricTimestamps.matchAll(extractTimestampRegex)) {
      const { min, sec, ms } = timestamp.groups;
      const rawTime = timestamp[0];
      const time = Number(min) * 60 + Number(sec) + Number(ms ?? 0) * 0.001;

      const parsedLyric = { rawTime, time, content: trimContent(content) };
      parsedLyrics.splice(binarySearch(parsedLyric), 0, parsedLyric);
    }
  }

  return parsedLyrics;
};
