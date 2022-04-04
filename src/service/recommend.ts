import { get } from '@/service/base'

import { IRecommendResult } from './type'

export function getRecommend() {
  return get<IRecommendResult>('/api/getRecommend')
}
