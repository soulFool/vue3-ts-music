export interface IRecommendAlbumsItem {
  id: number
  pic: string
  username: string
  title: string
}

export interface IRecommendSlidersItem {
  id: number
  link: string
  pic: string
}

export interface ISingerGroup {
  title: string
  list: ISingerGroupItem[]
}

export interface ISingerGroupItem {
  id: number
  mid: string
  name: string
  pic: string
}

export interface ISingerDetail {
  album: string
  duration: number
  id: number
  mid: string
  name: string
  pic: string
  singer: string
  url: string
  lyric?: string
}

export interface ITopListItem {
  id: number
  name: string
  period: string
  pic: string
  songList: ITopListSongItem[]
}

export interface ITopListSongItem {
  id: number
  singerName: string
  songName: string
}

export interface ISongListSelectItem {
  song: ISingerDetail
  index: number
}
