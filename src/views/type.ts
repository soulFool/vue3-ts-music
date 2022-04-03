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
