import { get } from './base'

import type { IHotKeysResult } from './type'

export function getHotKeys() {
  return get<IHotKeysResult>('/api/getHotKeys')
}
