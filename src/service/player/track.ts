import { defHttp } from "@/utils/http";
import { songs } from "@/service/static/songs";

enum PlayerApi {
  TrackUrl = "/song/url", // 获取音乐 url
  TrackDetail = "/song/detail", // 获取歌曲详情
  TrackLyric = "/lyric" // 获取歌词
}

/**
 * 获取音乐 url
 * @param {number} id
 * @param isStatic
 */
export const getTrackUrl = (id: number, isStatic: boolean = true) => {
  const getBar = "320000";
  if (isStatic) {
    let songsUrl = ["/music/happniess.mp3", "/music/cloud.m4a"];
    if (id === 1478005597) {
      return Promise.resolve(songsUrl[0]);
    } else {
      return Promise.resolve(songsUrl[1]);
    }
  }
  return defHttp.get({
    url: PlayerApi.TrackUrl,
    params: {
      id,
      br: getBar
    }
  });
};

/**
 * 获取歌曲详情
 * @param id
 * @param isStatic
 */
export const getTrackDetail = (id: number, isStatic: boolean = true) => {
  if (isStatic) {
    let songsIndex = 0;
    if (id === 1478005597) {
      songsIndex = 1;
    }
    return Promise.resolve(songs[songsIndex]);
  }
  return defHttp.get({
    url: PlayerApi.TrackDetail,
    params: {
      ids: id
    }
  });
};

/**
 * 获取歌词
 * @param id
 */
export const getTrackLyric = (id: number) => {
  return defHttp.get({
    url: PlayerApi.TrackLyric,
    params: {
      id
    }
  });
};
