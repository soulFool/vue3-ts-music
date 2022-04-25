import { get } from '@/service/base'

import type { IRecommendResult, ISingerDetailResult } from './type'
import type { IRecommendAlbumsItem } from '@/views/type'

export function getRecommend() {
  return get<IRecommendResult>('/api/getRecommend')
}

export function getAlbum(album: IRecommendAlbumsItem) {
  return get<ISingerDetailResult>('/api/getAlbum', {
    id: album.id
  })
}
