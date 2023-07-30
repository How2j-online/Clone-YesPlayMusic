//  歌单详情
export interface PlayListType {
  id: number;
  coverImgUrl: string;
  creator: {
    userId: number;
    nickname: string;
  };
  tracks: TacksT;
  trackIds: TrackIdsItemType[];
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

export interface TrackIdsItemType {
  id: number;
  v: number;
  t: number;
  at: number;
  alg: any;
  uid: number;
  rcmdReason: string;
  sc: any;
  f: any;
  sr: any;
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
  privilege?: Privilege;
  playable?: boolean;
}

export type TacksT = TracksItemType[];

// 专辑详情
export interface AlbumType {
  resourceState: boolean;
  songs: Song[];
  album: AlbumPType;
}

export interface Song {
  rtUrls: any[];
  ar: Ar[];
  al: Al;
  st: number;
  noCopyrightRcmd: any;
  songJumpInfo: any;
  alia: any[];
  pop: number;
  rt: string;
  mst: number;
  cp: number;
  crbt: any;
  cf: string;
  dt: number;
  h: H;
  sq: Sq;
  hr: any;
  l: L;
  rtUrl: any;
  ftype: number;
  rtype: number;
  rurl: any;
  pst: number;
  djId: number;
  no: number;
  fee: number;
  mv: number;
  t: number;
  v: number;
  cd: string;
  a: any;
  m: M;
  name: string;
  id: number;
  privilege: Privilege;
  playable: boolean;
  reason: string;
}

export interface Ar {
  id: number;
  name: string;
}

export interface Al {
  id: number;
  name: string;
  picUrl: string;
  pic_str: string;
  pic: number;
}

export interface H {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

export interface Sq {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

export interface L {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

export interface M {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

export interface Privilege {
  id: number;
  fee: number;
  payed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  toast: boolean;
  flag: number;
  preSell: boolean;
  playMaxbr: number;
  downloadMaxbr: number;
  maxBrLevel: string;
  playMaxBrLevel: string;
  downloadMaxBrLevel: string;
  plLevel: string;
  dlLevel: string;
  flLevel: string;
  rscl: any;
  freeTrialPrivilege: FreeTrialPrivilege;
  chargeInfoList: ChargeInfoList[];
}

export interface FreeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  listenType: any;
}

export interface ChargeInfoList {
  rate: number;
  chargeUrl: any;
  chargeMessage: any;
  chargeType: number;
}

export interface AlbumPType {
  songs: any[];
  paid: boolean;
  onSale: boolean;
  mark: number;
  awardTags: any;
  companyId: number;
  blurPicUrl: string;
  briefDesc: string;
  publishTime: number;
  company: string;
  alias: any[];
  artists: Artist[];
  copyrightId: number;
  picId: number;
  artist: Partial<Artist2>;
  picUrl: string;
  commentThreadId: string;
  pic: number;
  tags: string;
  description: string;
  status: number;
  subType: string;
  name: string;
  id: number;
  type: string;
  size: number;
  picId_str: string;
  info: Info;
}

export interface Artist {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  trans: string;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: any[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  name: string;
  id: number;
  img1v1Id_str: string;
}

export interface Artist2 {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  trans: string;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: any[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  name: string;
  id: number;
  img1v1Id_str: string;
}

export interface Info {
  commentThread: CommentThread;
  latestLikedUsers: any;
  liked: boolean;
  comments: any;
  resourceType: number;
  resourceId: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  threadId: string;
}

export interface CommentThread {
  id: string;
  resourceInfo: ResourceInfo;
  resourceType: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  hotCount: number;
  latestLikedUsers: any;
  resourceTitle: string;
  resourceOwnerId: number;
  resourceId: number;
}

export interface ResourceInfo {
  id: number;
  userId: number;
  name: string;
  imgUrl: string;
  creator: any;
  encodedId: any;
  subTitle: any;
  webUrl: any;
}

export interface AlbumDynamicType {
  onSale: boolean;
  albumGameInfo: any;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  isSub: boolean;
  subTime: number;
  subCount: number;
}
