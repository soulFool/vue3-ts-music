import { get } from '@/service/base'

import { ITopListResult } from './type'

export function getTopList() {
  return get<ITopListResult>('/api/getTopList')
}
