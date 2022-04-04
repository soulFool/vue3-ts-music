export interface IRecommendAlbumsItem {
  id: number
  pic: string
  username: string
  title: string
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
}
