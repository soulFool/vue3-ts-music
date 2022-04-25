import type { IRecommendAlbumsItem, IRecommendSlidersItem, ISingerGroup, ISingerDetail, ITopListItem } from '@/views/type'

export interface IResponseResult<T = any> {
  code: number
  result: T
}

export interface IRecommendResult {
  albums: IRecommendAlbumsItem[]
  sliders: IRecommendSlidersItem[]
}

export interface ISingerListResult {
  singers: ISingerGroup[]
}

export interface ISingerDetailResult {
  songs: ISingerDetail[]
}

export interface ISongResult {
  map: any
}

export interface IlyricMap {
  [key: string]: string
}

export interface ITopListResult {
  topList: ITopListItem[]
}
