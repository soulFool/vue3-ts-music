import { get } from './base'

import type { ISingerListResult, ISingerDetailResult } from './type'
import type { ISingerGroupItem } from '@/views/type'

export function getSingerList() {
  return get<ISingerListResult>('/api/getSingerList')
}

export function getSingerDetail(singer: ISingerGroupItem) {
  return get<ISingerDetailResult>('/api/getSingerDetail', {
    mid: singer.mid
  })
}
