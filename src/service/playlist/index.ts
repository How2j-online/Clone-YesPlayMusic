import { defHttp } from "@/utils/http";
import { staticPlaylist, albumDetail, albumDynamic, artistAlbum } from "@/service/static/playlist";

enum Playlist {
  PlaylistDetail = "/playlist/detail", // 获取歌单详情
  AlbumListDetail = "/album", // 获取专辑内容
  AlbumListDynamic = "/album/detail/dynamic", // 获取专辑动态信息
  ArtistAlbum = "/artist/album" // 获取歌手专辑
}

/**
 * 获取歌单详情
 * @param  {number} id
 * @param {boolean} noCache
 * @param isStatic
 */
export const getPlaylistDetail = (id: string | number, noCache: boolean = false, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(staticPlaylist);
  }
  let params: Partial<{ id: string | number; timestamp: number }> = { id };
  if (noCache) params.timestamp = new Date().getTime();
  return defHttp.get<SimpleKeyValueObject>({
    url: Playlist.PlaylistDetail,
    params
  });
};

/**
 * 获取专辑内容
 * @param id
 * @param noCache
 * @param isStatic
 */
export const getAlumListDetail = (id: string | number, noCache: boolean = false, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(albumDetail);
  }
  return defHttp.get({
    url: Playlist.AlbumListDetail,
    params: {
      id
    }
  });
};

/**
 * 获取专辑动态信息
 * @param id
 * @param noCache
 * @param isStatic
 */
export const getAlumListDynamic = (id: string | number, noCache: boolean = false, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(albumDynamic);
  }
  return defHttp.get({
    url: Playlist.AlbumListDynamic,
    params: {
      id,
      timestamp: new Date().getTime()
    }
  });
};

export const getArtistAlbum = (params: { id: number; limit?: number; offset?: number }, isStatic: boolean = true) => {
  if (isStatic) {
    return Promise.resolve(artistAlbum);
  }
  params = { limit: 30, offset: 0, ...params };
  return defHttp.get({
    url: Playlist.ArtistAlbum,
    params
  });
};
