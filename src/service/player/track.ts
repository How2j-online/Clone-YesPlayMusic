import { defHttp } from "@/utils/http";
import { songs, lyric } from "@/service/static/songs";

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
export const getTrackDetail = (id: number | string, isStatic: boolean = true) => {
  if (isStatic) {
    const song = songs.find(item => item.id === +id);
    return Promise.resolve({
      code: 200,
      songs: [song]
    });
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
 * @param isStatic
 */
export const getTrackLyric = (id: number, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(lyric);
  }
  return defHttp.get({
    url: PlayerApi.TrackLyric,
    params: {
      id
    }
  });
};
