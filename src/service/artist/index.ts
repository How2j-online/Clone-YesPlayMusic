import { defHttp } from "@/utils/http";
import { artistS, artistAlbumS, artistMv } from "@/service/static/artist";

enum ArtistApiPath {
  Artist = "/artist", // 获取歌手单曲
  ArtistAlbum = "/artist/album", // 获取歌手专辑
  TopListArtist = "/toplist/artist", // 获取歌手榜
  ArtistMv = "/artist/mv", // 获取歌手MV
  SubArtist = "/artist/sub", // 收藏/取消收藏歌手
  SimiArtist = "/simi/artist" // 获取相似歌手
}

const isStatic: boolean = true;

/**
 * 获取歌手单曲
 * @description: 获取歌手信息,包含热门歌曲
 * @param id
 */
export const getArtistSinger = (id: number) => {
  if (isStatic) return Promise.resolve(artistS);
  return defHttp.get({
    url: ArtistApiPath.Artist,
    params: {
      id
    }
  });
};

/**
 * 获取歌手专辑
 * @description: 获取歌手专辑
 * @param params
 */
export const getArtistAlbum = (params: { id: number; limit?: number; offset?: number }) => {
  if (isStatic) return Promise.resolve(artistAlbumS);
  params = { limit: 50, offset: 0, ...params };
  return defHttp.get({
    url: ArtistApiPath.ArtistAlbum,
    params
  });
};

/**
 * 歌手榜
 * @description: 获取歌手榜
 * @param type 取值 1-华语 2-欧美 3-韩国 4-日本
 */
export const getTopListArtist = (type: string | null) => {
  let params: Partial<{ type: string | null }> = {};
  if (type) params.type = type;
  return defHttp.get({
    url: ArtistApiPath.TopListArtist,
    params
  });
};

/**
 * 获取歌手MV
 * @description: 获取歌手MV
 * @param params
 */
export const getArtistMv = (params: { id: number; limit?: number; offset?: number }) => {
  if (isStatic) return Promise.resolve(artistMv);
  params = { limit: 10, offset: 0, ...params };
  return defHttp.get({
    url: ArtistApiPath.ArtistMv,
    params
  });
};

/**
 * 收藏/取消收藏歌手
 * @description: 收藏/取消收藏歌手
 * @param data
 * @param data.t 1为收藏,其他为取消收藏
 */
export const followArtist = (data: { id: number; t: number }) => {
  return defHttp.post({
    url: ArtistApiPath.SubArtist,
    data
  });
};

/**
 * 获取相似歌手
 * @param id
 */
export const similarArtist = (id: number) => {
  return defHttp.post({
    url: ArtistApiPath.SimiArtist,
    data: {
      id
    }
  });
};
