import { defHttp } from "@/utils/http";
import { PlayerItem, RecommendItem } from "@/service/home/type";
import { byAppleMusic, recommendPlayList, musicList } from "@/service/static/home";

// 获取 By Apple Music
export const getByAppleMusic = (isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ list: byAppleMusic });
  }
  return defHttp.get<{ list: PlayerItem[] }>({
    url: "/toplist/artist"
  });
};

// 获取 推荐歌单
export const getRecommendPlaylist = (params?: { limit: number }, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ result: recommendPlayList });
  }
  return defHttp.get<{ result: RecommendItem[] }>({
    url: "/personalized",
    params
  });
};

// 获取 推荐歌单
export const getDailyRecommendTracks = (isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve({ data: musicList });
  }
  return defHttp.get({
    url: "/recommend/songs",
    params: {
      timestamp: new Date().getTime()
    }
  });
};
