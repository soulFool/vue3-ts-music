import { get } from '@/service/base'

import { ITopListResult, ISingerDetailResult } from './type'
import { ITopListItem } from '@/views/type'

export function getTopList() {
  return get<ITopListResult>('/api/getTopList')
}

export function getTopDetail(top: ITopListItem) {
  return get<ISingerDetailResult>('api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
