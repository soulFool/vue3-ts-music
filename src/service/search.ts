import { get } from './base'

import type { IHotKeysResult, ISearchResult } from './type'

export function getHotKeys() {
  return get<IHotKeysResult>('/api/getHotKeys')
}

export function search(query: string, page: number, showSinger: boolean) {
  return get<ISearchResult>('/api/search', {
    query,
    page,
    showSinger
  })
}
