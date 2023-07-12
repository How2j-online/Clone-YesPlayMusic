import { defHttp } from "@/utils/http";
import { PlayerItem, RecommendPlayListItemType, RecommendTrackType } from "@/service/home/type";
import { byAppleMusic, recommendPlayList, musicList, artists, albumNewest, topList } from "@/service/static/home";

enum HomeApi {
  ByAppleMusic = "/toplist/artist",
  RecommendPlayList = "/personalized", // 推荐歌单
  DailyRecommendTracks = "/recommend/songs", // 推荐歌曲
  Artists = "/toplist/artist", // 推荐歌手
  AlbumNewest = "/album/newest", // 最新专辑
  TopList = "/toplist" // 所有榜单
}

// 获取 By Apple Music
export const getByAppleMusic = (isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ list: byAppleMusic });
  }
  return defHttp.get<{ list: PlayerItem[] }>({
    url: HomeApi.ByAppleMusic
  });
};

/**
 * 推荐歌单
 * @description Need Login
 * @example /personalized?limit=1
 * @param {object} params
 * @param {number} params.limit 默认为30
 * @param isStatic
 */
export const getRecommendPlaylist = (params?: { limit: number }, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ result: recommendPlayList });
  }
  return defHttp.get<{ result: RecommendPlayListItemType[] }>({
    url: HomeApi.RecommendPlayList,
    params
  });
};

/**
 * 每日推荐歌单
 * @description Need Login
 * @param isStatic
 */
export const getDailyRecommendTracks = (isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ data: musicList });
  }
  return defHttp.get<{ data: RecommendTrackType }>({
    url: HomeApi.DailyRecommendTracks,
    params: {
      timestamp: new Date().getTime()
    }
  });
};

/**
 * 推荐歌手
 * @param {string} type - 华语 韩国 日本
 * @param isStatic
 */
export const getArtists = (type: string | null = "", isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ artists: artists });
  }
  return defHttp.get({
    url: HomeApi.Artists,
    params: {
      type
    }
  });
};

/**
 *
 * @param isStatic
 * @param params
 * @param params.limit 返回数量 , 默认为 30
 * @param params.offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param params.area ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 */
export const getAlbumNewest = (params?: { limit: number; offset: number; area: string }, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ albums: albumNewest });
  }
  return defHttp.get({
    url: HomeApi.AlbumNewest
  });
};

export const getTopList = (isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ list: topList });
  }
  return defHttp.get({
    url: HomeApi.TopList
  });
};
