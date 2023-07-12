import { defHttp } from "@/utils/http";
import { staticPlaylist } from "@/service/static/playlist";

enum Playlist {
  PlaylistDetail = "/playlist/detail"
}

/**
 * 获取歌单详情
 * @param  {number} id
 * @param {boolean} noCache
 * @param isStatic
 */
export const getPlaylistDetail = (id: string, noCache: boolean = false, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(staticPlaylist);
  }
  let params: Partial<{ id: string; timestamp: number }> = { id };
  if (noCache) params.timestamp = new Date().getTime();
  return defHttp.get<SimpleKeyValueObject>({
    url: Playlist.PlaylistDetail,
    params
  });
};
