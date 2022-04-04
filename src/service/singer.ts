import { get } from './base'

import type { ISingerGroupItem } from '@/views/type'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: ISingerGroupItem) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
