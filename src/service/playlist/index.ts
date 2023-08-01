import { defHttp } from "@/utils/http";
import { staticPlaylist, albumDetail, albumDynamic, artistAlbum } from "@/service/static/playlist";
import { TopPlaylist } from "@/service/static/explores";
enum Playlist {
  PlaylistDetail = "/playlist/detail", // 获取歌单详情
  AlbumListDetail = "/album", // 获取专辑内容
  AlbumListDynamic = "/album/detail/dynamic", // 获取专辑动态信息
  ArtistAlbum = "/artist/album", // 获取歌手专辑
  PlaylistTags = "/playlist/highquality/tags", // 精品歌单标签列表
  QualityPlaylist = "/top/playlist/highquality", // 获取精品歌单
  AllTopPlaylist = "/toplist", // 获取所有榜单
  TopPlaylist = "/top/playlist" // 获取歌单 ( 网友精选碟 )
}
const isStatic = true;

/**
 * 获取歌单详情
 * @param  {number} id
 * @param {boolean} noCache
 */
export const getPlaylistDetail = (id: string | number, noCache: boolean = false) => {
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
 */
export const getAlumListDetail = (id: string | number, noCache: boolean = false) => {
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
 */
export const getAlumListDynamic = (id: string | number, noCache: boolean = false) => {
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

/**
 * 获取歌手专辑
 * @param params
 */
export const getArtistAlbum = (params: { id: number; limit?: number; offset?: number }) => {
  if (isStatic) {
    return Promise.resolve(artistAlbum);
  }
  params = { limit: 30, offset: 0, ...params };
  return defHttp.get({
    url: Playlist.ArtistAlbum,
    params
  });
};

/**
 * 获取精品歌单
 * @param params
 */
export const getQualityPlaylist = (
  params: { cat: string; limit?: number; before?: number; timestamp?: number } = { cat: "全部", limit: 20 }
) => {
  if (isStatic) {
  }
  return defHttp.get({
    url: Playlist.QualityPlaylist,
    params
  });
};

/**
 * 获取网友精选碟歌单
 * @param params
 */
export const getTopPlaylist = (
  params: { order?: "new" | "hot"; cat: string; offset: number } = {
    order: "hot",
    cat: "全部",
    offset: 20
  }
) => {
  if (isStatic) {
    return Promise.resolve(TopPlaylist);
  }
  return defHttp.get({
    url: Playlist.TopPlaylist,
    params
  });
};

/**
 * 获取所有榜单
 */
export const getTopLists = () => {
  return defHttp.get({
    url: Playlist.AllTopPlaylist
  });
};
