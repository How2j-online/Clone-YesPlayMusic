import { TracksItemType } from "@/service/playlist/type";
// artists
export interface ArtistType {
  artist: ArtistPType;
  hotSongs: HotSong[];
  more: boolean;
  code: number;
}

export interface ArtistPType {
  img1v1Id: number;
  topicPerson: number;
  alias: string[];
  picId: number;
  briefDesc: string;
  musicSize: number;
  albumSize: number;
  picUrl: string;
  img1v1Url: string;
  followed: boolean;
  trans: string;
  name: string;
  id: number;
  publishTime: number;
  picId_str: string;
  img1v1Id_str: string;
  mvSize: number;
}

export interface HotSong extends TracksItemType {}

export interface Ar {
  id: number;
  name: string;
  alia?: string[];
}

export interface Al {
  id: number;
  name: string;
  picUrl?: string;
  pic_str: string;
  pic: number;
  alia?: string[];
}

// artist/album
export interface ArtistAlbumType {
  artist: ArtistType;
  hotAlbums: HotAlbum[];
  more: boolean;
  code: number;
}

export interface ArtistType {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: string[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  trans: string;
  name: string;
  id: number;
  picId_str: string;
  img1v1Id_str: string;
}

export interface HotAlbum {
  songs: any[];
  paid: boolean;
  onSale: boolean;
  mark: number;
  awardTags: any;
  blurPicUrl: string;
  companyId: number;
  publishTime: number;
  company: string;
  briefDesc: string;
  alias: string[];
  artists: Artist2[];
  copyrightId: number;
  picId: number;
  artist: Artist3;
  pic: number;
  picUrl: string;
  commentThreadId: string;
  description: string;
  tags: string;
  status: number;
  subType: string;
  name: string;
  id: number;
  type: string;
  size: number;
  picId_str?: string;
  isSub: boolean;
}

export interface Artist2 {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: any[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  trans: string;
  name: string;
  id: number;
  img1v1Id_str: string;
}

export interface Artist3 {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: string[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  trans: string;
  name: string;
  id: number;
  picId_str?: string;
  img1v1Id_str: string;
}

// artist/mv
export interface ArtistMvType {
  mvs: Mv[];
  time: number;
  hasMore: boolean;
  code: number;
}

export interface Mv {
  id: number;
  name: string;
  status: number;
  imgurl: string;
  artist?: Artist;
  imgurl16v9: string;
  artistName: string;
  duration: number;
  playCount: number;
  publishTime: string;
  subed: boolean;
  vid?: number;
  title?: string;
  cover?: string;
  coverUrl?: string;
}

export interface Artist {
  img1v1Id: number;
  topicPerson: number;
  picUrl: string;
  img1v1Url: string;
  albumSize: number;
  trans: string;
  musicSize: number;
  briefDesc: string;
  alias: any[];
  picId: number;
  name: string;
  id: number;
  img1v1Id_str: string;
}
