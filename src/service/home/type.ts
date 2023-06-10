export interface PlayerItem {
  id: number;
  img1v1Url: string;
  picUrl: string;
  coverImgUrl: string;
  privacy: number;
  copywriter: string;
  description: string;
  updateFrequency: string;
  playCount: number;
  creator: { nickname: string };
  publishTime: number;
  mark: number;
  type: string;
  size: number;
  name: string;
  artist: { id: string; name: string } | undefined;
  artists: { id: string; name: string }[] | undefined;
}

export interface RecommendItem {
  id: number;
  type: number;
  name: string;
  copywriter: string;
  picUrl: string;
  canDislike: boolean;
  trackNumberUpdateTime: number;
  playCount: number;
  trackCount: number;
  highQuality: boolean;
  alg: string;
}
