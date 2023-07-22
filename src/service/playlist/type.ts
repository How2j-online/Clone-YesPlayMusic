//  歌单详情
import { TrackSongItem } from "@/service/common";

export interface PlayListType {
  id: number;
  coverImgUrl: string;
  creator: {
    userId: number;
    nickname: string;
  };
  tracks: TacksT;
  trackIds: [];
  privacy: number;
  name: string;
  updateTime: number;
  trackCount: number;
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  subscribed: boolean;
  englishTitle: string;
  updateFrequency: string;
}

export interface TracksItemType {
  id: number;
  songId: number;
  name: string;
  ar: { id: number; name: string; picUrl: string }[];
  al: { id: number; name: string; picUrl: string };
  // 专辑
  album?: object;
  simpleSong?: { al: { picUrl: string }; ar: { name: string }[] };
  reason?: string;
  mark?: number;
  dt?: number;
  playCount?: number;
}

export type TacksT = TracksItemType[];
